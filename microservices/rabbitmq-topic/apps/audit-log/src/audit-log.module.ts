import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuditLogController } from './audit-log.controller';
import { AuditLogSerializer } from './audit-log.serializer';
import { AuditLogService } from './audit-log.service';
import auditLogConfig from './configs/audit-log.config';
import { DatabaseConfig } from './configs/database.config';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { LogRepositoryModule } from './repository/repository.module';

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
    RabbitmqModule,
    LoggerModule,
    LogRepositoryModule,
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogSerializer],
})
export class AuditLogModule {}
