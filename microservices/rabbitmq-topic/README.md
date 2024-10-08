# No Taxi No Fun

Here I will try to implement Direct exchange type explained [here](../../.github/docs/rabbitmq/README.md#topicExchangeType). So to implement that scenario I need to have these microservices:

> [!IMPORTANT]
>
> If your message does have a validation issue, the you're message will be rejected by the class-validator. But the funny part is that you won't see any error in terminal on the receiver part, neither you'll get an error on the sender side :grin:.

## Topic exchange scenario

1. When driver changes.
2. When verification changes.

> [!NOTE]
>
> The retry logic will be logged multiple times in _audit-log_. Add some sort of logic if you wanna to log only once. Can do also more fun stuff like logging that some messages were dropped due to reaching max `retryCount` and still not being able to process them.

## How to run

1. `cd microservices/rabbitmq-topic`.
2. `pnpm install`.
3. `docker compose up --build -d`.

Now you can send requests to it via Swagger.

### E2E tests

You need the first 2 step and then you can do the following:

1. `chmod +x run-e2e.sh`.
2. `./run-e2e.sh`.
   - Add `--build` flag to build the images without using docker caches.
   - Add `--tracer` flag to enable, and configure RabbitMQ's Firehose Tracer feature.
