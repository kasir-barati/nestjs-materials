import {
  createSwaggerConfiguration,
  databaseConfig,
  writeOpenApi,
} from '@app/common';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as Sinon from 'sinon';
import reservationServiceConfig from '../../src/reservation-service.config';
import { ReservationController } from '../../src/reservation/reservation.controller';
import { ReservationService } from '../../src/reservation/reservation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      load: [databaseConfig, reservationServiceConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [ReservationController],
  providers: [
    {
      provide: ReservationService,
      useValue: Sinon.stub(ReservationService),
    },
  ],
})
class OpenApiModule {}

async function createOpenApi() {
  const app = await NestFactory.create(OpenApiModule);
  const { SWAGGER_PATH, RESERVATION_SERVICE_PORT } = app.get<
    ConfigType<typeof reservationServiceConfig>
  >(reservationServiceConfig.KEY);
  const document = createSwaggerConfiguration({
    app,
    swaggerPath: SWAGGER_PATH,
    title: 'The reservation booking system RESTful API.',
    appUrl: `http://localhost:${RESERVATION_SERVICE_PORT}`,
    description: 'The reservation booking system RESTful API.',
  });
  const openApiOutputDirectory = join(
    process.cwd(),
    'apps',
    'reservation-service',
  );
  const openApiFilePath = writeOpenApi(
    document,
    openApiOutputDirectory,
  );

  Logger.log(
    `OpenAPI specification created: ${openApiFilePath}`,
    'OpenApiModule',
  );
}

createOpenApi()
  .then(() => {
    Logger.log('OpenAPI specification created', 'OpenApiModule');
    process.exit(0);
  })
  .catch(() => {
    Logger.error(
      'OpenAPI specification failed to be created',
      'OpenApiModule',
    );
  });
