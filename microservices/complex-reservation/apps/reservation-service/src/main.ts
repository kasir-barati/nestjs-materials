import { createSwaggerConfiguration } from '@app/common';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import reservationServiceConfig from './configs/reservation-service.config';
import { ReservationServiceModule } from './reservation-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ReservationServiceModule);
  const { SWAGGER_PATH, RESERVATION_SERVICE_PORT } = app.get<
    ConfigType<typeof reservationServiceConfig>
  >(reservationServiceConfig.KEY);
  const appUrl = `http://localhost:${RESERVATION_SERVICE_PORT}/`;

  app.use(cookieParser());
  app.use(bodyParser.json({ type: ['json', '+json'] }));
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 400,
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
    }),
  );
  app.useLogger(app.get(Logger));

  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'Reservation microservice.',
    description: 'Reservation microservice RESTful API.',
  });

  await app.listen(RESERVATION_SERVICE_PORT);
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
