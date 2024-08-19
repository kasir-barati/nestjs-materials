import { createSwaggerConfiguration } from '@app/common';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth-service.module';
import authServiceConfig from './configs/auth-service.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const { SWAGGER_PATH, AUTH_SERVICE_PORT } = app.get<
    ConfigType<typeof authServiceConfig>
  >(authServiceConfig.KEY);
  const appUrl = `http://localhost:${AUTH_SERVICE_PORT}/`;

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

  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'Auth microservice.',
    description: 'Auth microservice RESTful API.',
  });

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
