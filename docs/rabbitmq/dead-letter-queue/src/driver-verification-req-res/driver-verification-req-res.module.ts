import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../configs/app.config';
import { DriverVerificationReqResModuleConfig } from './driver-verification-req-res.config';
import { DriverVerificationReqResService } from './driver-verification-req-res.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      useClass: DriverVerificationReqResModuleConfig,
    }),
  ],
  providers: [DriverVerificationReqResService],
  exports: [RabbitMQModule],
})
export class DriverVerificationReqResModule {}
