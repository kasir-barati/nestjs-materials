# Dead Letter Queue (DLQ) Manual Reprocessing

## Overview

This implementation provides a manual DLQ reprocessing mechanism that allows you to control when failed messages are retried. Messages that fail after maximum retry attempts are sent to a Dead Letter Queue where they pile up instead of being processed automatically. You can then trigger reprocessing via an API endpoint.

## How It Works

### 1. Message Flow

```
┌─────────────┐
│  Publisher  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  events-queue   │ ◄─── Main queue with retry logic
└────────┬────────┘
         │
         │ (Failed after max retries)
         ▼
┌─────────────────┐
│   events-dlq    │ ◄─── Dead Letter Queue (messages pile up here)
└─────────────────┘
         │
         │ (Manual reprocessing via API)
         ▼
┌─────────────────┐
│  events-queue   │ ◄─── Messages republished to main queue
└─────────────────┘
```

### 2. Key Changes

#### **Removed Automatic DLQ Consumer**
The `@RabbitSubscribe` decorator for the DLQ has been removed from `EventConsumer`. Messages now accumulate in the `events-dlq` queue without being automatically processed.

#### **Created EventService**
A new `EventService` provides the `reprocessDLQMessages()` method that:
- Fetches all messages from the DLQ using `channel.get()`
- Extracts original routing information from dead letter headers
- Republishes messages back to the source queue
- Resets the `x-delivery-count` to 0 for fresh retry attempts
- Removes dead letter specific headers
- Tracks success/error counts

#### **Added API Endpoint**
`POST /users/reprocess-events` - Triggers manual DLQ reprocessing

## Usage

### 1. Let Messages Accumulate in DLQ

Create users and let some messages fail:

```bash
# Create multiple users
curl -X POST http://localhost:3000/users

# Some messages will fail and end up in DLQ after retries
```

### 2. Check DLQ Status (Optional)

You can use RabbitMQ Management UI or CLI to check the DLQ:

```bash
# Using rabbitmqadmin (if installed)
rabbitmqadmin list queues name messages

# Or check via Management UI
# http://localhost:15672/#/queues
```

### 3. Trigger Manual Reprocessing

Call the reprocessing API endpoint:

```bash
curl -X POST http://localhost:3000/users/reprocess-events
```

**Response:**
```json
{
  "processed": 5,
  "errors": 0
}
```

- `processed`: Number of messages successfully republished to the source queue
- `errors`: Number of messages that failed during republishing (these remain in DLQ)

### 4. Monitor Logs

The application logs provide detailed information:

```
[EventService] Starting DLQ reprocessing. Messages in queue: 5
[EventService] Republishing message to exchange: events, routingKey: user.registered
[EventService] Message republished successfully: {"messageId":"...","userInfo":{...}}
[EventService] Successfully republished message 1/5
...
[EventService] DLQ reprocessing completed. Processed: 5, Errors: 0
```

## API Documentation

### POST /users/reprocess-events

Reprocesses all messages from the Dead Letter Queue (DLQ).

**Request:**
```bash
POST /users/reprocess-events
```

**Response:** `200 OK`
```json
{
  "processed": 5,
  "errors": 0
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Technical Details

### Message Republishing Logic

When republishing messages, the service:

1. **Extracts Original Routing Information:**
   - `x-first-death-exchange`: Original exchange name
   - `x-first-death-routing-key`: Original routing key

2. **Resets Headers:**
   - Sets `x-delivery-count` to `0`
   - Preserves `correlation-id` for tracing
   - Removes dead letter headers (`x-death`, `x-first-death-*`)

3. **Publishes to Source Queue:**
   - Messages are published with `persistent: true`
   - They enter the normal retry flow again

### Error Handling

- If republishing fails, the message is `nack`'ed with `requeue: true` to keep it in the DLQ
- Errors are logged with full context
- The API returns counts of both successful and failed reprocessing attempts

### Queue Configuration

**events-queue** (Main Queue):
```javascript
{
  durable: true,
  arguments: {
    'x-queue-type': 'quorum',
    'x-dead-letter-exchange': 'events.dlx',
    'x-dead-letter-routing-key': 'user.dead-letter',
  }
}
```

**events-dlq** (Dead Letter Queue):
```javascript
{
  durable: true,
  arguments: {
    'x-queue-type': 'quorum',
  }
}
```

## Best Practices

1. **Monitor DLQ Size**: Set up alerts when messages accumulate in the DLQ
2. **Investigate Before Reprocessing**: Check logs to understand why messages failed
3. **Fix Root Causes**: Address the underlying issues before reprocessing
4. **Scheduled Reprocessing**: Consider running reprocessing during off-peak hours
5. **Partial Reprocessing**: For large volumes, you might want to add pagination/batching

## Future Enhancements

Potential improvements to consider:

1. **Selective Reprocessing**: Reprocess specific messages by ID or criteria
2. **Batch Processing**: Process messages in batches instead of all at once
3. **Dead Letter TTL**: Automatically expire old messages from DLQ
4. **Retry Limits**: Limit how many times a message can be reprocessed from DLQ
5. **Message Inspection**: Add GET endpoint to view DLQ messages without consuming them
6. **Scheduled Reprocessing**: Cron job to automatically retry DLQ messages

## Troubleshooting

### Messages Not Appearing in DLQ

- Check that `RABBITMQ_MAX_RETRY_COUNT` is set correctly
- Verify the dead letter exchange and routing key configuration
- Check RabbitMQ logs for binding issues

### Reprocessing Fails

- Verify RabbitMQ connection is healthy
- Check that the original exchange and queue still exist
- Review application logs for specific error messages

### Messages Keep Failing

- The messages might have invalid data
- External dependencies might be unavailable
- Consider implementing message inspection before reprocessing
