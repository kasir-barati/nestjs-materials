import {
  DRIVER_CREATED_ROUTING_KEY,
  DRIVER_VERIFICATION_REQ_QUEUE,
  TOPIC_EXCHANGE,
} from '@app/common';
import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import driverApiConfig from '../configs/driver-api.config';

export class RabbitmqModuleConfig
  implements ModuleConfigFactory<RabbitMQConfig>
{
  constructor(
    @Inject(driverApiConfig.KEY)
    private readonly driverApiConfigs: ConfigType<
      typeof driverApiConfig
    >,
  ) {}

  createModuleConfig(): RabbitMQConfig | Promise<RabbitMQConfig> {
    const { RABBITMQ_URL } = this.driverApiConfigs;

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
          name: DRIVER_VERIFICATION_REQ_QUEUE,
          routingKey: DRIVER_CREATED_ROUTING_KEY,
          createQueueIfNotExists: true,
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
