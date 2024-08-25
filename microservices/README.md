# Microservices

Here I'll try to examine and put into practice microservices.

- [A complete NestJS app](./complex-reservation/README.md).

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

#### Why request-response messaging style?

- No need to implement a message ACK protocol.
- Exchange messages between various external services.

### Messaging mechanisms

| Name             | Description                                                                                                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Messaging Queues | Asynchronously communication through RabbitMQ, Apache Kafka, or Amazon SQS. Decouples communication. Supports event-driven architectures.                                                |
| Event Streaming  | Services produce and consume events. Real-time communication and data processing. Useful for when we need to process events asynchronously and distribute them across multiple services. |
| NATS             | An infrastructure that allows data exchange, segmented in the form of messages. It is a messaging system. Designed for building distributed systems & microservices architectures.       |

# RabbitMQ

- `connectMicroservice` only connects to a queue (or create it if needed). In other words, it performs `assertQueue` operation ([ref](https://stackoverflow.com/a/68935959/8784518)).
