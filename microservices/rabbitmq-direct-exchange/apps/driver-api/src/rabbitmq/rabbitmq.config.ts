import {
  DIRECT_EXCHANGE,
  DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
  DRIVER_VERIFICATION_REQ_RES_QUEUE,
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
          name: DIRECT_EXCHANGE,
          type: 'direct',
        },
      ],
      queues: [
        {
          name: DRIVER_VERIFICATION_REQ_RES_QUEUE,
          routingKey: DRIVER_VERIFICATION_REQ_RES_QUEUE,
          createQueueIfNotExists: true,
        },
        {
          name: DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
          routingKey: DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
          createQueueIfNotExists: true,
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
