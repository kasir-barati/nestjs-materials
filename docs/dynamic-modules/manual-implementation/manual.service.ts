import { Inject, Injectable, Logger } from '@nestjs/common';

import { MODULE_OPTIONS_TOKEN } from './manual.constant';
import { Options } from './manual.interface';

@Injectable()
export class ManualService {
  private readonly logger = new Logger(ManualService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: Options,
  ) {
    this.logger.log(options.someOption);
  }
}
