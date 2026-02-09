import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  MODULE_OPTIONS_TOKEN,
  MyModuleOptions,
} from './my.module-definition';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: MyModuleOptions,
  ) {
    this.logger.log(options.batchSize);
    this.logger.log(options.maxRetryAttempts);
    this.logger.log(options.processingIntervalMs);
  }
}
