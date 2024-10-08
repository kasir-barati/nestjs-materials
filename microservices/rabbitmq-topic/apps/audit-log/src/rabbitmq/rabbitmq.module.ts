import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import auditLogApiConfig from '../configs/audit-log.config';
import { LogRepositoryModule } from '../repository/repository.module';
import { RabbitmqModuleConfig } from './rabbitmq.config';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule.forFeature(auditLogApiConfig)],
      useClass: RabbitmqModuleConfig,
    }),
    LogRepositoryModule,
  ],
  providers: [RabbitmqService],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
