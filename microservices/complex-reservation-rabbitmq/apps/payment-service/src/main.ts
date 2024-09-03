import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import paymentServiceConfig from './configs/payment-service.config';
import { PaymentServiceModule } from './payment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);
  const { RABBITMQ_URI, PAYMENT_QUEUE } = app.get<
    ConfigType<typeof paymentServiceConfig>
  >(paymentServiceConfig.KEY);

  app.connectMicroservice<RmqOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URI],
        queue: PAYMENT_QUEUE,
        // Explicit acknowledgement of messages is required.
        noAck: false,
      },
    },
    { inheritAppConfig: true },
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.startAllMicroservices();
}
bootstrap();
