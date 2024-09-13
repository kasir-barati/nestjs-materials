import { createSwaggerConfiguration } from '@app/common';
import { writeOpenApi } from '@app/testing';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as Sinon from 'sinon';
import verificationApiConfig from '../../src/configs/verification-api.config';
import { VerificationController } from '../../src/verification/verification.controller';
import { VerificationSanitizer } from '../../src/verification/verification.sanitizer';
import { VerificationService } from '../../src/verification/verification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'driver-api', '.env'),
      ],
      load: [verificationApiConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [VerificationController],
  providers: [
    {
      provide: VerificationService,
      useValue: Sinon.stub(VerificationService),
    },
    {
      provide: VerificationSanitizer,
      useValue: Sinon.stub(VerificationSanitizer),
    },
  ],
})
class OpenApiModule {}

async function createOpenApi() {
  const app = await NestFactory.create(OpenApiModule);
  const { SWAGGER_PATH, VERIFICATION_API_PORT } = app.get<
    ConfigType<typeof verificationApiConfig>
  >(verificationApiConfig.KEY);
  const document = createSwaggerConfiguration({
    app,
    swaggerPath: SWAGGER_PATH,
    title: 'The auth RESTful API.',
    appUrl: `http://localhost:${VERIFICATION_API_PORT}`,
    description: 'The auth RESTful API.',
  });
  const openApiOutputDirectory = join(
    process.cwd(),
    'apps',
    'verification-api',
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
