import { EmailNotificationMicroservicesPayload } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { SMTP_TRANSPORTER_INSTANCE } from './constants/smtp-transport.constant';

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
  ): Promise<boolean> {
    const { email, ...rest } = data;

    return await this.transporter
      .sendMail({
        to: email,
        ...rest,
      })
      .then(() => true)
      .catch((error) => {
        // retry, log it in a audit log collection/table, or push it to failed messages queue.
        this.logger.error(error);
        return false;
      });
  }
}
