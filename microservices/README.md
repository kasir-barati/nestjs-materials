# Microservices

Here I'll try to examine and put into practice microservices.

- [Complex Reservation with TCP](./complex-reservation/README.md).
- [Complex Reservation with RabbitMQ](./complex-reservation-rabbitmq/README.md).
- [No Taxi No Fun with RabbitMQ](./no-taxi-no-fun/README.md).

## Its concept

Microservices are small programs, each with a specific and narrow scope, that are glued together to produce what appears from the outside to be one coherent web application.

- To connect microservices over network (transmits messages between different services) we will use:
  - Network protocols (request-response).
  - Messaging mechanisms (event-based).
- In NestJS TCP by default is the way to go.
- **Patterns** in NestJS are automatically serialized and sent over the network along with the data portion of a message. Which requests are consumed by which handlers.

### Network protocols

- Use `@MessagePattern()` to create a message handler based on the request-response paradigm.
- For example here we are using "service name" written in `compose.yaml` as `AUTH_HOST` address.

| Name       | Description                                                                                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP/HTTPS | Each microservice exposes endpoints that other services can call to request or manipulate data. Synchronous request/response-based.                             |
| gRPC       | Allows services to call methods or procedures on remote services as if they were local. High-performance communication using protocol buffers and HTTP/2.       |
| TCP        | Reliable, connection-oriented communication channel between microservices. Useful for when you're communicating within docker network or microservices cluster. |

#### `@MessagePattern` Versus `@EventPattern`

|           | `@MessagePattern`                                                                                       | `@EventPattern`                                                                                                                                                                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AKA       | Request-response pattern.                                                                               | Event-based pattern.                                                                                                                                                                                                                                                                                                  |
| Upsides   | Simple to work with, and easy to debug.                                                                 | Register multiple event handlers for the same event (they will all fire in parallel). Asynchronous by default, the connection after sending the request is closed immediately. Thus more flexibility, as they offer the opportunity to create complex architectures that scale more easily and are highly responsive. |
| Downsides | Connection to the other service being locked until it sends back a response(Potential time out errors). | Harder time to debug issues.                                                                                                                                                                                                                                                                                          |

- No need to implement a message ACK protocol.
- Exchange messages between various external services.

### Messaging mechanisms

| Name             | Description                                                                                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Messaging Queues | Asynchronously communication through RabbitMQ, Apache Kafka, or Amazon SQS. Decouples communication. Supports event-driven architectures.                                                |
| Event Streaming  | Services produce and consume events. Real-time communication and data processing. Useful for when we need to process events asynchronously and distribute them across multiple services. |
| NATS             | An infrastructure that allows data exchange, segmented in the form of messages. It is a messaging system. Designed for building distributed systems & microservices architectures.       |

# RabbitMQ

- Learn more about [RabbitMQ and its role in microservices](../.github/docs/rabbitmq/README.md).
- Although `connectMicroservice` only connects to a queue (or create it if needed. it performs `assertQueue` operation ([ref](https://stackoverflow.com/a/68935959/8784518)) you can always extend `ServerRmq` class, learn more [here](https://github.com/nestjs/nest/issues/3981#issuecomment-581126236).

# Kafka

- Learn more [here](../.github/docs/kafka/README.md).
