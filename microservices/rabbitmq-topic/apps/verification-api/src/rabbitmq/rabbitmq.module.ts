import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import verificationApiConfig from '../configs/verification-api.config';
import { VerificationRepositoryModule } from '../verification/repository/verification-repository.module';
import { RabbitmqModuleConfig } from './rabbitmq.config';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule.forFeature(verificationApiConfig)],
      useClass: RabbitmqModuleConfig,
    }),
    VerificationRepositoryModule,
  ],
  providers: [RabbitmqService],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
