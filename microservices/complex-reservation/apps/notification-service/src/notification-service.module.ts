import { LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import notificationServiceConfig from './configs/notification-service.config';
import { smtpTransporterFactory } from './configs/smtp-transport.config';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [notificationServiceConfig],
      envFilePath: [
        join(process.cwd(), 'apps', 'notification-service', '.env'),
      ],
    }),
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService, smtpTransporterFactory],
})
export class NotificationServiceModule {}
