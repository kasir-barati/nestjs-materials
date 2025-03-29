import { ConsoleLogger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { appConfig } from './libs/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );
  const Logger = app.get(ConsoleLogger);

  Logger.log(`Running on port ${PORT}`);

  await app.listen(PORT);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
