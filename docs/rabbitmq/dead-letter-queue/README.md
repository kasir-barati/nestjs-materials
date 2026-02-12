# Dead Letter Queue

- What is the appropriate exchange type for the DLQ messages? There is **NOT** a special "DLQ exchange type" in RabbitMQ.
  - A DLQ is just a normal queue that receives messages routed through a dead‑letter exchange (DLX).
  - You can use any exchange type for the DLX (direct, topic, fanout, headers). Choose based on your routing needs:
    - **Direct**: simplest and most common when all dead letters for a source queue go to a single DLQ.
    - **Topic**: good if you want to route dead letters to different DLQs based on routing patterns (e.g., by tenant, domain, or original routing key).
    - **Fanout**: rarely used; would broadcast dead letters to multiple queues (usually not desirable).
    - **Headers**: uncommon unless you specifically need header-based routing.
- Can I have an API (let's imagine `POST /users/reprocess-events` which is in `app.controller.ts`), that will trigger the DLQ consumer to starts consuming messages? Yes, actually exposing an admin-only "redrive DLQ" action is a common and reasonable practice.
  - Put strong guardrails around it (authN/Z, rate limits, observability, idempotency, and safe defaults).
  - **DLQ Redrive** refers to the process of moving messages that have been transferred to a Dead Letter Queue (DLQ) back to their original source queue (or another specified queue) for reprocessing.

## Recommended patterns for DLQ reprocessing

- **Treat DLQ as quarantine**:
  - Messages landed there because they exceeded retries or failed deterministically.
  - Default state should be do nothing until an operator decides to reprocess.
- **Expose a controlled "Redrive" operation (via admin-only API/CLI or runbook)**:
  - Do **NOT** process inline in the request. Kick off a background job and return 202 Accepted with a task ID.
  - Throttling (e.g., max N msgs/sec), batching, and stop-on-error switches help avoid cascading failures.
  - Idempotency: ensure your business processing is idempotent or you dedupe at the consumer level.
  - Observability: log counts, error reasons, first/last message IDs, and expose metrics.
  - Audit & Access: require elevated permissions and record who/what/when for redrives.
- **Choose a redrive strategy**:
  - Move back to source queue/topic (most common). Let normal consumers handle it.
  - Consume in place from DLQ with a dedicated on-demand worker.
  - Move into a “retry” queue with backoff (e.g., 5m → 1h → 24h) if the underlying issue is transient.
- **Safety guardrails**:
  - Dry-run: sample or list messages without moving them.
  - Limit: maxMessages, maxDuration.
  - Filter: only reprocess certain event types or time ranges.
  - Poison message handling: if the same payload fails again, park it (e.g., “parking-lot queue/topic”) for manual inspection.

## How it Works

1. RabbitMQ increases the `x-delivery-count` header with each retry automatically, no need for your majesty to do anything!
   - RabbitMQ increases this counter by one each time we throw an error in our handler.
   - We are **CANNOT** auto acknowledging messages.
2. In `@RabbitSubscribe` decorator we should configure `x-dead-letter-exchange` and `x-dead-letter-routing-key` properties of a queue. This way it will know what it should do once it reaches the maximum retry count (we have to configure this as a policy separately).
3. Lastly we need to create a policy for the queue to automatically send a message to the DLQ:
   - To do this we need to configure the `delivery-limit` policy (learn more [here](https://www.rabbitmq.com/docs/quorum-queues#position-message-handling-configuring-limit)).
   - We cannot configure policies unfortunately with `@golevelup/nestjs-rabbitmq` or `amqplib`. But we can configure it like this:
     ```cmd
     $ curl -u $RABBITMQ_DEFAULT_USER:$RABBITMQ_DEFAULT_PASS \
            -H "content-type: application/json" \
            -X PUT http://$RABBITMQ_HTTP_BASE_URL/api/policies/%2F/events-poison-limit \
            -d '{"pattern":"^events-queue$","definition":{"delivery-limit":3,"dead-letter-exchange":"events.dlx","dead-letter-routing-key":"events.dead-letter"},"priority":10,"apply-to":"queues"}'
     ```
     This is exactly what `this.rabbitmqPolicyService.upsertDeliveryLimitPolicy(...)` does for us. Another way of configuring it is using `rabbitmqctl`:
     ```cmd
     $ rabbitmqctl set_policy --vhost / --apply-to queues events-poison-limit \
                   '^events-queue$' \
                   '{"delivery-limit": 3, "dead-letter-exchange":"events.dlx", "dead-letter-routing-key":"events.dead-letter"}' \
                   --priority 10
     ```
   - You can of course handle the retry and pushing the messages to the DLQ inside the `errorHandler`. But that is too much work.

> [!NOTE]
>
> If user triggers the reprocess and it fails we requeue the message in the DLQ. So client can trigger the reprocessing once more. The only reason this might happen is that we fail to publish the message back to the normal queue, or something else goes wrong before that (e.g. some assumptions turns out to be wrong). 

## How to start it

1. `pnpm install`.
2. `cp .env.example .env`.
3. `docker compose up -d`.
