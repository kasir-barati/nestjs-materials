import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import appConfig from './app/configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);

  Logger.log(
    `🚀 Application is running on: http://localhost:${PORT}/graphql`,
  );
}

bootstrap();
