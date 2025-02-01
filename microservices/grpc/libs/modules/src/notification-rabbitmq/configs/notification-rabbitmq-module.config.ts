import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import {
  NOTIFICATION_QUEUE,
  SEND_EMAIL_NOTIFICATION,
  TOPIC_EXCHANGE,
} from '@grpc/shared';
import { ConfigurableModuleOptionsFactory, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import notificationRabbitmqConfig from './notification-rabbitmq.config';

export class RabbitmqModuleConfig
  implements ConfigurableModuleOptionsFactory<RabbitMQConfig, 'create'>
{
  constructor(
    @Inject(notificationRabbitmqConfig.KEY)
    private readonly notificationRabbitmqConfigs: ConfigType<
      typeof notificationRabbitmqConfig
    >
  ) {}

  create(): RabbitMQConfig | Promise<RabbitMQConfig> {
    const { RABBITMQ_URL } = this.notificationRabbitmqConfigs;

    return {
      uri: RABBITMQ_URL,
      exchanges: [
        {
          name: TOPIC_EXCHANGE,
          type: 'topic',
        },
      ],
      queues: [
        {
          name: NOTIFICATION_QUEUE,
          routingKey: SEND_EMAIL_NOTIFICATION,
          createQueueIfNotExists: true,
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
