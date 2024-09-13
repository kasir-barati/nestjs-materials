import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import driverApiConfig from '../configs/driver-api.config';
import { DriverRepositoryModule } from '../driver/repository/driver-repository.module';
import { RabbitmqModuleConfig } from './rabbitmq.config';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule.forFeature(driverApiConfig)],
      useClass: RabbitmqModuleConfig,
    }),
    DriverRepositoryModule,
  ],
  providers: [RabbitmqService],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
