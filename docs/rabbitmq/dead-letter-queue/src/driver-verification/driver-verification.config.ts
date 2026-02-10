import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigurableModuleOptionsFactory, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import {
  DRIVER_VERIFICATION_REQ_HEADER,
  DRIVER_VERIFICATION_REQ_QUEUE,
  HEADERS_EXCHANGE,
} from '../app.constant';
import appConfig from '../configs/app.config';

export class DriverVerificationModuleConfig implements ConfigurableModuleOptionsFactory<
  RabbitMQConfig,
  'create'
> {
  constructor(
    @Inject(appConfig.KEY)
    private readonly verificationApiConfigs: ConfigType<typeof appConfig>,
  ) {}

  create(): RabbitMQConfig | Promise<RabbitMQConfig> {
    const { RABBITMQ_URL } = this.verificationApiConfigs;

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
          name: DRIVER_VERIFICATION_REQ_QUEUE,
          exchange: HEADERS_EXCHANGE,
          createQueueIfNotExists: true,
          bindQueueArguments: {
            'x-match': 'any',
            [DRIVER_VERIFICATION_REQ_HEADER]: DRIVER_VERIFICATION_REQ_QUEUE,
          },
          options: {
            arguments: {
              'x-queue-type': 'quorum',
              'x-match': 'any',
              [DRIVER_VERIFICATION_REQ_HEADER]: DRIVER_VERIFICATION_REQ_QUEUE,
            },
          },
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
