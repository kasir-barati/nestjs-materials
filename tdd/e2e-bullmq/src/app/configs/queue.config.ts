import type { ConfigType } from '@nestjs/config';

import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull';
import { Inject } from '@nestjs/common';

import { appConfig } from '../../libs/shared';

export class QueueConfig implements BullOptionsFactory {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfigs: ConfigType<typeof appConfig>,
  ) {}

  createBullOptions():
    | Promise<BullModuleOptions>
    | BullModuleOptions {
    return {
      prefix: this.appConfigs.APP_NAME,
    };
  }
}
