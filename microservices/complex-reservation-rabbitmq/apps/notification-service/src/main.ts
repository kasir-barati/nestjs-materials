import { getNotificationOptions } from '@app/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import notificationServiceConfig from './configs/notification-service.config';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const {
    RABBITMQ_URI,
    NOTIFICATION_QUEUE,
    NOTIFICATION_DLQ,
    NOTIFICATION_TTL,
  } = app.get<ConfigType<typeof notificationServiceConfig>>(
    notificationServiceConfig.KEY,
  );
  const queueOptions = getNotificationOptions({
    url: RABBITMQ_URI,
    dlq: NOTIFICATION_DLQ,
    queue: NOTIFICATION_QUEUE,
    messageTtl: NOTIFICATION_TTL,
  });

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      // Explicit acknowledgement of messages is required.
      noAck: false,
      urls: [RABBITMQ_URI],
      queue: NOTIFICATION_QUEUE,
      queueOptions,
    },
  });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.startAllMicroservices();
}
bootstrap();
