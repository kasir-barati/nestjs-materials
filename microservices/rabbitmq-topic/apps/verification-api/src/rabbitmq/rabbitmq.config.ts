import {
  DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
  DRIVER_VERIFICATION_RES_QUEUE,
  TOPIC_EXCHANGE,
  VERIFICATION_CREATED_ROUTING_KEY,
  VERIFICATION_DELETED_ROUTING_KEY,
} from '@app/common';
import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import verificationApiConfig from '../configs/verification-api.config';

export class RabbitmqModuleConfig
  implements ModuleConfigFactory<RabbitMQConfig>
{
  constructor(
    @Inject(verificationApiConfig.KEY)
    private readonly verificationApiConfigs: ConfigType<
      typeof verificationApiConfig
    >,
  ) {}

  createModuleConfig(): RabbitMQConfig | Promise<RabbitMQConfig> {
    const { RABBITMQ_URL } = this.verificationApiConfigs;

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
          name: DRIVER_VERIFICATION_RES_QUEUE,
          routingKey: VERIFICATION_CREATED_ROUTING_KEY,
          createQueueIfNotExists: true,
        },
        {
          name: DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
          routingKey: VERIFICATION_DELETED_ROUTING_KEY,
          createQueueIfNotExists: true,
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
