import {
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
  RpcValidationFilter,
} from '@app/common';
import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { DeadLetterNotificationServiceService } from './dead-letter-notification-service.service';

@Controller()
export class DeadLetterNotificationServiceController {
  constructor(
    private readonly deadLetterNotificationServiceService: DeadLetterNotificationServiceService,
  ) {}

  @UseFilters(new RpcValidationFilter())
  @EventPattern(EVENT_PATTERN_FOR_EMAIL_NOTIFICATION)
  async sendEmailNotification(
    @Payload() data: EmailNotificationMicroservicesPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel: Channel = context.getChannelRef();
    const originalMessage = context.getMessage() as Message;

    await this.deadLetterNotificationServiceService.sendEmailNotification(
      data,
      channel,
      originalMessage,
    );
  }
}
