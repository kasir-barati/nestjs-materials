import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import notificationServiceConfig from './configs/notification-service.config';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const { RABBITMQ_URI, NOTIFICATION_QUEUE } = app.get<
    ConfigType<typeof notificationServiceConfig>
  >(notificationServiceConfig.KEY);

  app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        noAck: false,
        urls: [RABBITMQ_URI],
        queue: NOTIFICATION_QUEUE,
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
