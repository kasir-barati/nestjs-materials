import { createSwaggerConfiguration } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import verificationApiConfig from './configs/verification-api.config';
import { VerificationApiModule } from './verification-api.module';

async function bootstrap() {
  const app = await NestFactory.create(VerificationApiModule);
  const { VERIFICATION_API_PORT, SWAGGER_PATH } = app.get<
    ConfigType<typeof verificationApiConfig>
  >(verificationApiConfig.KEY);
  const appUrl = `http://localhost:${VERIFICATION_API_PORT}/`;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: 400,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'Driver API microservice.',
    description: 'Driver API microservice RESTful API.',
  });

  await app.listen(VERIFICATION_API_PORT);
}
bootstrap();
