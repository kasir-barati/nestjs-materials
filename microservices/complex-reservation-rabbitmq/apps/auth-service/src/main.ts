import { createSwaggerConfiguration } from '@app/common';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AuthModule } from './auth-service.module';
import authServiceConfig from './configs/auth-service.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const {
    SWAGGER_PATH,
    AUTH_SERVICE_PORT,
    RABBITMQ_URI,
    AUTH_QUEUE,
  } = app.get<ConfigType<typeof authServiceConfig>>(
    authServiceConfig.KEY,
  );
  const appUrl = `http://localhost:${AUTH_SERVICE_PORT}/`;

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URI],
      queue: AUTH_QUEUE,
    },
  });
  app.use(cookieParser());
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
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'Auth microservice.',
    description: 'Auth microservice RESTful API.',
  });

  await app.startAllMicroservices();
  await app.listen(AUTH_SERVICE_PORT);
  NestLogger.log(
    'Application is up and running: ' + appUrl,
    'NestApplication',
  );
  NestLogger.log(
    'Swagger is up and running: ' + appUrl + SWAGGER_PATH,
    'NestApplication',
  );
}
bootstrap();
