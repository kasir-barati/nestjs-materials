import { createSwaggerConfiguration } from '@app/common';
import { writeOpenApi } from '@app/testing';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as Sinon from 'sinon';
import { AuthController } from '../../auth/src/auth.controller';
import { AuthSerializer } from '../../auth/src/auth.serializer';
import authConfig from '../../auth/src/configs/auth.config';
import { AuthService } from '../../auth/src/services/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'auth', '.env'),
      ],
      load: [authConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useValue: Sinon.stub(AuthService),
    },
    {
      provide: AuthSerializer,
      useValue: Sinon.stub(AuthSerializer),
    },
  ],
})
class OpenApiModule {}

async function createOpenApi() {
  const app = await NestFactory.create(OpenApiModule);
  const { SWAGGER_PATH, AUTH_API_PORT } = app.get<
    ConfigType<typeof authConfig>
  >(authConfig.KEY);
  const document = createSwaggerConfiguration({
    app,
    swaggerPath: SWAGGER_PATH,
    title: 'The auth RESTful API.',
    appUrl: `http://localhost:${AUTH_API_PORT}`,
    description: 'The auth RESTful API.',
  });
  const openApiOutputDirectory = join(process.cwd(), 'apps', 'auth');
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
  .catch((e) => {
    Logger.error(e);
    Logger.error(
      'OpenAPI specification failed to be created',
      'OpenApiModule',
    );
  });
