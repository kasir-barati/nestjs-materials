import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { join } from 'path';

import { appConfig, CorrelationIdModule } from '../libs/shared';
import { APP_QUEUE } from './app.constant';
import { AppController } from './app.controller';
import { AppProcessor } from './app.processor';
import { AppService } from './app.service';
import { BullmoduleConfig } from './configs/bull-module.config';
import { QueueConfig } from './configs/queue.config';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig],
      envFilePath: [join(process.cwd(), '.env')],
    }),
    BullModule.forRootAsync({
      useClass: BullmoduleConfig,
      imports: [ConfigModule.forFeature(appConfig)],
    }),
    BullModule.registerQueueAsync({
      name: APP_QUEUE,
      imports: [ConfigModule.forFeature(appConfig)],
      useClass: QueueConfig,
    }),
    CorrelationIdModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppProcessor],
})
export class AppModule {}
