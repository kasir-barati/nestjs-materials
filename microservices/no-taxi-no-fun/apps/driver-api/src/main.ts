import { createSwaggerConfiguration } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import driverApiConfig from './configs/driver-api.config';
import { DriverApiModule } from './driver-api.module';

async function bootstrap() {
  const app = await NestFactory.create(DriverApiModule);
  const { DRIVER_API_PORT, SWAGGER_PATH } = app.get<
    ConfigType<typeof driverApiConfig>
  >(driverApiConfig.KEY);
  const appUrl = `http://localhost:${DRIVER_API_PORT}/`;

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

  await app.listen(DRIVER_API_PORT);
}
bootstrap();
