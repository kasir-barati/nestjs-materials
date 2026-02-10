import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { urlBuilder } from './utils';
import { createSwaggerConfiguration } from './utils/create-swagger-configuration.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const PORT = 3000;
  const SWAGGER_PATH = '/docs';
  const appUrl = `http://localhost:${PORT}/`;
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: 400,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );

  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'App API.',
    description: 'App API RESTful API.',
  });

  await app.listen(PORT);
  logger.log(`Application is running on: ${appUrl}`);
  logger.log(`Swagger is available on: ${urlBuilder(appUrl, SWAGGER_PATH)}`);
}
bootstrap();
