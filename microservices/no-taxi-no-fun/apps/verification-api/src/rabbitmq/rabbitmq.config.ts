import {
  DIRECT_EXCHANGE,
  DRIVER_VERIFICATION_REQ_QUEUE,
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
          name: DIRECT_EXCHANGE,
          type: 'direct',
        },
      ],
      queues: [
        {
          name: DRIVER_VERIFICATION_REQ_QUEUE,
          routingKey: DRIVER_VERIFICATION_REQ_QUEUE,
          createQueueIfNotExists: true,
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
