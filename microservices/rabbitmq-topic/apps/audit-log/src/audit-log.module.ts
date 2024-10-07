import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuditLogController } from './audit-log.controller';
import auditLogConfig from './configs/audit-log.config';
import { DatabaseConfig } from './configs/database.config';
import { Log, LogSchema } from './entities/log.entity';
import { AuditLogSerializer } from './services/audit-log-serializer.service';
import { AuditLogService } from './services/audit-log.service';
import { LogRepository } from './services/log-repository.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'audit-log', '.env'),
      ],
      load: [auditLogConfig],
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule.forRootAsync({
      useClass: DatabaseConfig,
      imports: [ConfigModule.forFeature(auditLogConfig)],
    }),
    DatabaseModule.forFeature([
      {
        name: Log.name,
        schema: LogSchema,
      },
    ]),
    LoggerModule,
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogSerializer, LogRepository],
})
export class AuditLogModule {}
