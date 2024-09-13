import { Controller, Get } from '@nestjs/common';
import { AuditLogApiService } from './audit-log-api.service';

@Controller()
export class AuditLogApiController {
  constructor(private readonly auditLogApiService: AuditLogApiService) {}

  @Get()
  getHello(): string {
    return this.auditLogApiService.getHello();
  }
}
