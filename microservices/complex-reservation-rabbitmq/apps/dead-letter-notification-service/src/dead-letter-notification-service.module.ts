import {
  DatabaseModule,
  LoggerModule,
  NOTIFICATION_SERVICE,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { join } from 'path';
import { DatabaseConfig } from './configs/database.config';
import deadLetterNotificationServiceConfig from './configs/dead-letter-notification-service.config';
import { NotificationClientsModuleConfig } from './configs/notification-client-module.config';
import { DeadLetterNotificationServiceController } from './dead-letter-notification-service.controller';
import { DeadLetterNotificationServiceService } from './dead-letter-notification-service.service';
import {
  FailedEmail,
  FailedEmailSchema,
} from './entities/failed-email.entity';
import { FailedEmailRepository } from './repositories/failed-email.repository';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [deadLetterNotificationServiceConfig],
      envFilePath: [
        join(process.cwd(), '.env'),
        join(
          process.cwd(),
          'apps',
          'dead-letter-notification-service',
          '.env',
        ),
      ],
    }),
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE,
        imports: [
          ConfigModule.forFeature(
            deadLetterNotificationServiceConfig,
          ),
        ],
        useClass: NotificationClientsModuleConfig,
      },
    ]),
    DatabaseModule.forRootAsync({
      imports: [
        ConfigModule.forFeature(deadLetterNotificationServiceConfig),
      ],
      useClass: DatabaseConfig,
    }),
    DatabaseModule.forFeature([
      { name: FailedEmail.name, schema: FailedEmailSchema },
    ]),
  ],
  controllers: [DeadLetterNotificationServiceController],
  providers: [
    DeadLetterNotificationServiceService,
    FailedEmailRepository,
  ],
})
export class DeadLetterNotificationServiceModule {}
