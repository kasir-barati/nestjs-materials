import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import paymentServiceConfig from './configs/payment-service.config';
import { PaymentServiceModule } from './payment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);
  const { TCP_PORT } = app.get<
    ConfigType<typeof paymentServiceConfig>
  >(paymentServiceConfig.KEY);

  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: TCP_PORT,
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
      transformOptions: {
        enableImplicitConversion: true,
      },
      validateCustomDecorators: true,
    }),
  );

  await app.startAllMicroservices();
}
bootstrap();
