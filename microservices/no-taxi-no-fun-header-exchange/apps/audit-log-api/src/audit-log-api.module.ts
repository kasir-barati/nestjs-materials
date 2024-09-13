import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AuditLogApiController } from './audit-log-api.controller';
import { AuditLogApiService } from './audit-log-api.service';

@Module({
  imports: [LoggerModule],
  controllers: [AuditLogApiController],
  providers: [AuditLogApiService],
})
export class AuditLogApiModule {}
