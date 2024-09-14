import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { createSwaggerConfiguration } from './utils/create-swagger-configuration.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = 3000;
  const appUrl = `http://localhost:${PORT}/`;
  const logger = app.get(Logger);

  app.use(bodyParser.json({ type: ['json', '+json'] }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: '/docs',
    title: 'Test nestjs-pino.',
    description: 'Test nestjs-pino.',
  });

  logger.log(`Server is accessible on ${appUrl}`);

  await app.listen(PORT);
}
bootstrap();
