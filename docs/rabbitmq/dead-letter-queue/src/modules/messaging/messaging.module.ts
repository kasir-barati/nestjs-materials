import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
              name: 'events',
              type: 'topic',
            },
            {
              name: 'events.dlx',
              type: 'topic',
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
  exports: [RabbitMQModule],
})
export class MessagingModule {}
