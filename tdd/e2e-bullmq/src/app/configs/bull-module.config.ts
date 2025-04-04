import type { ConfigType } from '@nestjs/config';

import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Inject } from '@nestjs/common';

import { appConfig } from '../../libs/shared';

export class BullmoduleConfig
  implements SharedBullConfigurationFactory
{
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {}
  createSharedConfiguration():
    | Promise<BullRootModuleOptions>
    | BullRootModuleOptions {
    return {
      prefix: this.appConfigs.APP_NAME,
      redis: {
        host: this.appConfigs.REDIS_HOST,
        port: this.appConfigs.REDIS_PORT,
        password: this.appConfigs.REDIS_PASSWORD,
      },
    };
  }
}
