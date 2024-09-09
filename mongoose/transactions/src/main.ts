import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import appConfig from './configs/app.config';
import { createSwaggerConfiguration } from './utils/create-swagger-configuration.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT, SWAGGER_PATH } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );
  const appUrl = `http://localhost:${PORT}/`;

  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'Transaction API microservice.',
    description: 'Transaction API microservice RESTful API.',
  });
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(PORT);
}
bootstrap();
