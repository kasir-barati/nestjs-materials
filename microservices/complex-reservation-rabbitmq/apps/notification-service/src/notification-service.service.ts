import { EmailNotificationMicroservicesPayload } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Channel, Message } from 'amqplib';
import { Transporter } from 'nodemailer';
import { SMTP_TRANSPORTER_INSTANCE } from './notification-service.constant';

@Injectable()
export class NotificationServiceService {
  private readonly logger: Logger;

  constructor(
    @Inject(SMTP_TRANSPORTER_INSTANCE)
    private readonly transporter: Transporter,
  ) {
    this.logger = new Logger(NotificationServiceService.name);
  }

  async sendEmailNotification(
    data: EmailNotificationMicroservicesPayload,
    channel: Channel,
    message: Message,
  ): Promise<void> {
    const { email, ...rest } = data;

    try {
      await this.transporter.sendMail({
        to: email,
        ...rest,
      });

      channel.ack(message);
    } catch (error) {
      this.logger.error(error);

      channel.reject(message, false);
    }
  }
}
