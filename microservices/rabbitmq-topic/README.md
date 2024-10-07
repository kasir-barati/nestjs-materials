# No Taxi No Fun

Here I will try to implement Direct exchange type explained [here](../../.github/docs/rabbitmq/README.md#topicExchangeType). So to implement that scenario I need to have these microservices:

## Topic exchange scenario

1. When a new driver is created I will log it in the audit-log service
2. When verification state changes.
