import {
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
  NOTIFICATION_SERVICE,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import deadLetterNotificationServiceConfig from './configs/dead-letter-notification-service.config';
import { FailedEmailRepository } from './repositories/failed-email.repository';

@Injectable()
export class DeadLetterNotificationServiceService {
  constructor(
    @Inject(deadLetterNotificationServiceConfig.KEY)
    private readonly deadLetterNotificationServiceConfigs: ConfigType<
      typeof deadLetterNotificationServiceConfig
    >,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationServiceClient: ClientProxy,
    private readonly failedEmailRepository: FailedEmailRepository,
  ) {}

  async sendEmailNotification(
    data: EmailNotificationMicroservicesPayload,
    channel: Channel,
    message: Message,
  ): Promise<void> {
    const { MAX_RETRY_COUNT } =
      this.deadLetterNotificationServiceConfigs;
    // Increase the retry count by 1 or set it to 1 if it's undefined
    const retryCount = (data.retryCount ?? 0) + 1;

    if (retryCount > MAX_RETRY_COUNT) {
      const { email, retryCount, ...rest } = data;

      await this.failedEmailRepository.create({
        to: email,
        ...rest,
        failedAfterRetryCount: MAX_RETRY_COUNT,
      });
    } else {
      this.notificationServiceClient.emit(
        EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
        { ...data, retryCount },
      );
    }

    channel.ack(message);
  }
}
