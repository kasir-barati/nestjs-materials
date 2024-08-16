import { createSwaggerConfiguration } from '@app/common';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import reservationServiceConfig from './reservation-service.config';
import { ReservationServiceModule } from './reservation-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ReservationServiceModule);
  const { SWAGGER_PATH, RESERVATION_SERVICE_PORT } = app.get<
    ConfigType<typeof reservationServiceConfig>
  >(reservationServiceConfig.KEY);
  const appUrl = `http://localhost:${RESERVATION_SERVICE_PORT}/`;

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

  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'Reservation service.',
    description: 'Reservation service.',
  });

  await app.listen(RESERVATION_SERVICE_PORT);
  Logger.log(
    'Application is up and running: ' + appUrl,
    'NestApplication',
  );
  Logger.log(
    'Swagger is up and running: ' + appUrl + SWAGGER_PATH,
    'NestApplication',
  );
}
bootstrap();
