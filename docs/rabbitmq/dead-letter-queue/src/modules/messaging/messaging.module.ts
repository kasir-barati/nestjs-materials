import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  EVENTS_EXCHANGE,
  EVENTS_EXCHANGE_TYPE,
  EXCHANGE_OF_DLQ_FOR_EVENTS_QUEUE,
  EXCHANGE_TYPE_OF_DLQ_FOR_EVENTS_QUEUE,
} from '../../shared';
import { RabbitmqPolicyService } from './rabbitmq-policy.service';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const prefetchCount = Number(
          configService.getOrThrow('RABBITMQ_PREFETCH_COUNT'),
        );

        return {
          uri: configService.getOrThrow('RABBITMQ_URL'),
          exchanges: [
            {
              name: EVENTS_EXCHANGE,
              type: EVENTS_EXCHANGE_TYPE,
            },
            {
              name: EXCHANGE_OF_DLQ_FOR_EVENTS_QUEUE,
              type: EXCHANGE_TYPE_OF_DLQ_FOR_EVENTS_QUEUE,
            },
          ],
          channels: {
            'dlq-channel': {
              prefetchCount,
              default: true,
            },
          },
          prefetchCount,
          enableControllerDiscovery: true,
        };
      },
    }),
  ],
  providers: [RabbitmqPolicyService],
  exports: [RabbitMQModule, RabbitmqPolicyService],
})
export class MessagingModule {}
