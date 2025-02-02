import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app/app.module';
import { USER_PACKAGE_NAME } from './assets/interfaces/user.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:3000`,
      package: USER_PACKAGE_NAME,
      protoPath: [join(__dirname, 'assets', 'user.proto')],
      loader: {
        includeDirs: [join(__dirname, 'assets')],
      },
      keepalive: {
        keepaliveTimeMs: 120000,
        keepaliveTimeoutMs: 20000,
        keepalivePermitWithoutCalls: 1,
      },
    },
  });

  const port = process.env.PORT || 3000;

  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
