# Share RabbitMQ connection with a Dynamic Module

A Dockerized NestJS application demonstrating the use of ConfigurableModuleBuilder for creating dynamic modules with RabbitMQ integration.

## Features

- ✅ Dynamic module configuration using `ConfigurableModuleBuilder`.
- ✅ RabbitMQ integration with `@golevelup/nestjs-rabbitmq`.
- ✅ Event publishing with routing key `some.event`.
- ✅ Event consumer in AppModule.
- ✅ Docker and Docker Compose setup.
- ✅ Node.js 24.13.

> [!NOTE]
> 
> **Best practice: register RabbitMQ once and reuse the connection**.
>
> RabbitMQ connections are **expensive**; In NestJS with `@golevelup/nestjs-rabbitmq`, the usual pattern is:
>
> - Configure `RabbitMQModule` once in your app (root module or a shared module).
> - Export the connection provider (`AmqpConnection`) so feature modules can inject it.
> - Do not call `RabbitMQModule.forRoot/forRootAsync` again inside feature modules unless you intentionally want another, named connection.


