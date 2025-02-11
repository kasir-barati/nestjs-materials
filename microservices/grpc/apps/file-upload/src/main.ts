import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';
import { FILE_PACKAGE_NAME } from './assets/interfaces/file-upload.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:3000`,
      package: FILE_PACKAGE_NAME,
      protoPath: [join(__dirname, 'assets', 'file-upload.proto')],
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

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/`,
  );
}

bootstrap();
