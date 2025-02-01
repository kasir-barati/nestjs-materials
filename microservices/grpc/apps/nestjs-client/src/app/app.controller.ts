import { Controller, Get } from '@nestjs/common';

import { AppHealthCheckResponse } from '@grpc/shared';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  healthCheck(): AppHealthCheckResponse {
    return this.appService.healthCheck();
  }
}
