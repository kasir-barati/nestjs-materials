import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../configs/app.config';
import { DriverVerificationModuleConfig } from './driver-verification.config';
import { DriverVerificationService } from './driver-verification.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      useClass: DriverVerificationModuleConfig,
    }),
  ],
  providers: [DriverVerificationService],
  exports: [RabbitMQModule],
})
export class DriverVerificationModule {}
