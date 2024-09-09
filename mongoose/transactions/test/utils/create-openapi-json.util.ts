import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as Sinon from 'sinon';
import appConfig from '../../src/configs/app.config';
import { ProductController } from '../../src/product/product.controller';
import { ProductService } from '../../src/product/product.service';
import { createSwaggerConfiguration } from '../../src/utils/create-swagger-configuration.util';
import { writeOpenApi } from './generate-openapi.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      load: [appConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: ProductService,
      useValue: Sinon.stub(ProductService),
    },
  ],
})
class OpenApiModule {}

async function createOpenApi() {
  const app = await NestFactory.create(OpenApiModule);
  const { SWAGGER_PATH, PORT } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );
  const document = createSwaggerConfiguration({
    app,
    swaggerPath: SWAGGER_PATH,
    title: 'The reservation booking system RESTful API.',
    appUrl: `http://localhost:${PORT}`,
    description: 'The reservation booking system RESTful API.',
  });
  const openApiOutputDirectory = process.cwd();
  const openApiFilePath = writeOpenApi(document, openApiOutputDirectory);

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
    Logger.error('OpenAPI specification failed to be created', 'OpenApiModule');
  });
