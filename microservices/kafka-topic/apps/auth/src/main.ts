import { createSwaggerConfiguration } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AuthModule } from './auth.module';
import authConfig from './configs/auth.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const { AUTH_API_PORT, SWAGGER_PATH } = app.get<
    ConfigType<typeof authConfig>
  >(authConfig.KEY);
  const appUrl = `http://localhost:${AUTH_API_PORT}/`;

  app.use(bodyParser.json({ type: ['json', '+json'] }));
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: 400,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'Driver API microservice.',
    description: 'Driver API microservice RESTful API.',
  });

  await app.listen(AUTH_API_PORT);
}
bootstrap();
