import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigurableModuleOptionsFactory, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import {
  DRIVER_VERIFICATION_REQ_RES_QUEUE,
  HEADERS_EXCHANGE,
} from '../app.constant';
import appConfig from '../configs/app.config';

export class DriverVerificationReqResModuleConfig implements ConfigurableModuleOptionsFactory<
  RabbitMQConfig,
  'create'
> {
  constructor(
    @Inject(appConfig.KEY)
    private readonly driverApiConfigs: ConfigType<typeof appConfig>,
  ) {}

  create(): RabbitMQConfig | Promise<RabbitMQConfig> {
    const { RABBITMQ_URL } = this.driverApiConfigs;

    return {
      uri: RABBITMQ_URL,
      exchanges: [
        {
          name: HEADERS_EXCHANGE,
          type: 'headers',
        },
      ],
      queues: [
        {
          name: DRIVER_VERIFICATION_REQ_RES_QUEUE,
          createQueueIfNotExists: true,
          options: {
            arguments: {
              'x-queue-type': 'quorum',
            },
          },
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
