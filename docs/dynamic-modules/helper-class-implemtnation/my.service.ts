import { Inject, Injectable, Logger } from '@nestjs/common';

import type {
  ExtraMyModuleOptions,
  MyModuleOptions,
} from './my.module-definition';
import {
  MODULE_EXTRAS_TOKEN,
  MODULE_OPTIONS_TOKEN,
} from './my.module-definition';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: MyModuleOptions,
    @Inject(MODULE_EXTRAS_TOKEN) private readonly extras: ExtraMyModuleOptions,
  ) {
    this.logger.log(`Options: ${JSON.stringify(this.options, null, 2)}`);
    this.logger.log(`Extras: ${JSON.stringify(this.extras, null, 2)}`);
  }
}
