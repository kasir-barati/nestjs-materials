# RabbitMQ + MongoDB ObjectId

Publishes events to a RabbitMQ queue with a nested body containing MongoDB `ObjectId` values, and a consumer that shows how they arrive.

## Run

```bash
docker compose up --build -d
```

Services:

- `rabbitmq` — broker with management UI at http://localhost:15672 (guest/guest)
- `publisher` — publishes one event every 3s to queue `demo.events`
- `consumer` — reads events and prints them two ways (plain JSON vs EJSON revived)

## What you'll see

The publisher serializes the payload with **EJSON** (`bson.EJSON.stringify`), so an `ObjectId` on the wire looks like:

```
docker compose logs consumer
```

```json
{
  "eventId": { "$oid": "6a4cb20dbecca72bedbc2715" }, // NOT really nice!
  "eventType": "order.created",
  "occurredAt": { "$date": { "$numberLong": "1783411213129" } },
  "payload": {
    "orderId": { "$oid": "6a4cb20dbecca72bedbc2714" },
    "user": {
      "_id": "6a4cb20dbecca72bedbc2713", // converted to string
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "address": {
        "street": "221B Baker Street",
        "city": "London",
        "country": "UK"
      }
    },
    "items": [
      {
        "sku": "SKU-001",
        "qty": { "$numberInt": "2" },
        "price": { "$numberDouble": "19.99" },
        "itemId": { "$oid": "6a4cb20dbecca72bedbc2716" }
      },
      {
        "sku": "SKU-002",
        "qty": { "$numberInt": "1" },
        "price": { "$numberDouble": "49.5" },
        "itemId": { "$oid": "6a4cb20dbecca72bedbc2717" }
      }
    ],
    "totals": {
      "subtotal": { "$numberDouble": "89.48" },
      "tax": { "$numberDouble": "7.16" },
      "grandTotal": { "$numberDouble": "96.64" },
      "currency": "EUR"
    }
  }
}
```

The consumer parses each message twice:

1. `JSON.parse` — `ObjectId` stays as `{ "$oid": "..." }` (a plain object).
2. `EJSON.parse` — `ObjectId` is revived into a real `ObjectId` instance (you can call `.toHexString()` on it).
