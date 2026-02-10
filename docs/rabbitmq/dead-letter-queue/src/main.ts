import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { urlBuilder } from './utils';
import { createSwaggerConfiguration } from './utils/create-swagger-configuration.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = 3000;
  const SWAGGER_PATH = '/docs';
  const appUrl = `http://localhost:${PORT}/`;
  const logger = new Logger('NestApplication');

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
