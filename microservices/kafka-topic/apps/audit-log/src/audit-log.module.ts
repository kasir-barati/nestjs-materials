import {
  DatabaseModule,
  LoggerModule,
  MessagingModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuditLogController } from './audit-log.controller';
import { LogRepository } from './audit-log.repository';
import { AuditLogSerializer } from './audit-log.serializer';
import auditLogConfig from './configs/audit-log.config';
import { DatabaseConfig } from './configs/database.config';
import { Log, LogSchema } from './entities/log.entity';
import { AuditLogService } from './services/audit-log.service';
import { LogHandlerService } from './services/log-handler.service';
import { LogSubscriberService } from './services/log-subscriber.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'auth', '.env'),
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
    MessagingModule.forRoot({
      module: 'audit-log',
      application: 'audit-log',
    }),
  ],
  controllers: [AuditLogController],
  providers: [
    LogRepository,
    AuditLogService,
    LogHandlerService,
    AuditLogSerializer,
    LogSubscriberService,
  ],
})
export class AuditLogModule {}
