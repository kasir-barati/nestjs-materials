import {
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
  RpcValidationFilter,
} from '@app/common';
import {
  Controller,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { NotificationServiceService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
  ) {}

  @UseFilters(new RpcValidationFilter())
  @EventPattern(EVENT_PATTERN_FOR_EMAIL_NOTIFICATION)
  async sendEmailNotification(
    @Payload(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        errorHttpStatusCode: 400,
        validateCustomDecorators: true,
      }),
    )
    data: EmailNotificationMicroservicesPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel: Channel = context.getChannelRef();
    const originalMessage = context.getMessage() as Message;

    await this.notificationServiceService.sendEmailNotification(
      data,
      channel,
      originalMessage,
    );
  }
}
