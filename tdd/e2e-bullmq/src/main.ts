import { ConsoleLogger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { appConfig } from './libs/shared';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );
  const Logger = app.get(ConsoleLogger);

  Logger.log(`Running on port ${PORT}`);

  await app.listen(PORT);
}

bootstrap();
