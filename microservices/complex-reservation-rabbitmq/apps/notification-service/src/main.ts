import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import notificationServiceConfig from './configs/notification-service.config';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const { RABBITMQ_URI, NOTIFICATION_QUEUE, NOTIFICATION_DLQ } =
    app.get<ConfigType<typeof notificationServiceConfig>>(
      notificationServiceConfig.KEY,
    );

  app.connectMicroservice<RmqOptions>(
    {
      transport: Transport.RMQ,
      options: {
        // Explicit acknowledgement of messages is required.
        noAck: false,
        urls: [RABBITMQ_URI],
        queue: NOTIFICATION_QUEUE,
        queueOptions: {
          // set message time to live to 1 minute
          messageTtl: 60000,
          // Setup the DLX to point to the default exchange.
          deadLetterExchange: '',
          // Our notification dead letters should be routed to the this DLQ.
          deadLetterRoutingKey: NOTIFICATION_DLQ,
          // Maximum number of messages: https://github.com/amqp-node/amqplib/blob/64d1c1ec19afa64a7ec5c355ea7620f0b227fb30/lib/api_args.js#L59
          maxLength: 13,
        },
      },
    },
    { inheritAppConfig: true },
  );
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 400,
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );

  await app.startAllMicroservices();
}
bootstrap();
