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
import { AuthServiceController } from '../../src/auth-service.controller';
import { AuthServiceService } from '../../src/auth-service.service';
import authServiceConfig from '../../src/configs/auth-service.config';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'auth-service', '.env'),
      ],
      load: [databaseConfig, authServiceConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [UserController, AuthServiceController],
  providers: [
    {
      provide: UserService,
      useValue: Sinon.stub(UserService),
    },
    {
      provide: AuthServiceService,
      useValue: Sinon.stub(AuthServiceService),
    },
  ],
})
class OpenApiModule {}

async function createOpenApi() {
  const app = await NestFactory.create(OpenApiModule);
  const { SWAGGER_PATH, AUTH_SERVICE_PORT } = app.get<
    ConfigType<typeof authServiceConfig>
  >(authServiceConfig.KEY);
  const document = createSwaggerConfiguration({
    app,
    swaggerPath: SWAGGER_PATH,
    title: 'The auth RESTful API.',
    appUrl: `http://localhost:${AUTH_SERVICE_PORT}`,
    description: 'The auth RESTful API.',
  });
  const openApiOutputDirectory = join(
    process.cwd(),
    'apps',
    'auth-service',
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
