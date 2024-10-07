import { createSwaggerConfiguration } from '@app/common';
import { writeOpenApi } from '@app/testing';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as Sinon from 'sinon';
import driverApiConfig from '../../driver-api/src/configs/driver-api.config';
import { DriverController } from '../../driver-api/src/driver/driver.controller';
import { DriverSanitizer } from '../../driver-api/src/driver/driver.sanitizer';
import { DriverService } from '../../driver-api/src/driver/driver.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'driver-api', '.env'),
      ],
      load: [driverApiConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [DriverController],
  providers: [
    {
      provide: DriverService,
      useValue: Sinon.stub(DriverService),
    },
    {
      provide: DriverSanitizer,
      useValue: Sinon.stub(DriverSanitizer),
    },
  ],
})
class OpenApiModule {}

async function createOpenApi() {
  const app = await NestFactory.create(OpenApiModule);
  const { SWAGGER_PATH, DRIVER_API_PORT } = app.get<
    ConfigType<typeof driverApiConfig>
  >(driverApiConfig.KEY);
  const document = createSwaggerConfiguration({
    app,
    swaggerPath: SWAGGER_PATH,
    title: 'The auth RESTful API.',
    appUrl: `http://localhost:${DRIVER_API_PORT}`,
    description: 'The auth RESTful API.',
  });
  const openApiOutputDirectory = join(
    process.cwd(),
    'apps',
    'driver-api',
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
