import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitmqModuleConfig } from './configs/notification-rabbitmq-module.config';
import notificationRabbitmqConfigs from './configs/notification-rabbitmq.config';
import { NotificationRabbitmqService } from './notification-rabbitmq.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule.forFeature(notificationRabbitmqConfigs)],
      useClass: RabbitmqModuleConfig,
    }),
  ],
  providers: [NotificationRabbitmqService],
  exports: [RabbitMQModule],
})
export class NotificationRabbitmqModule {}
