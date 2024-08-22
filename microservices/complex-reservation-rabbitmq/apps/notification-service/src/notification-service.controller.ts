import {
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
  RpcValidationFilter,
} from '@app/common';
import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationServiceService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
  ) {}

  @UseFilters(new RpcValidationFilter())
  @EventPattern(EVENT_PATTERN_FOR_EMAIL_NOTIFICATION)
  sendEmailNotification(
    @Payload() data: EmailNotificationMicroservicesPayload,
  ): Promise<boolean> {
    return this.notificationServiceService.sendEmailNotification(
      data,
    );
  }
}
