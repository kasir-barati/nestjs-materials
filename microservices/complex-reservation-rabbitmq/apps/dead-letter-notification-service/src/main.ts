import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import deadLetterNotificationServiceConfig from './configs/dead-letter-notification-service.config';
import { DeadLetterNotificationServiceModule } from './dead-letter-notification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(
    DeadLetterNotificationServiceModule,
  );
  const { RABBITMQ_URI, NOTIFICATION_DLQ } = app.get<
    ConfigType<typeof deadLetterNotificationServiceConfig>
  >(deadLetterNotificationServiceConfig.KEY);

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      // Explicit acknowledgement of messages is required.
      noAck: false,
      urls: [RABBITMQ_URI],
      queue: NOTIFICATION_DLQ,
    },
  });
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
}
bootstrap();
