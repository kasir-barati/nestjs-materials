import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SMTP_TRANSPORTER_INSTANCE } from '../notification-service.constant';
import { NotificationServiceConfig } from '../notification-service.type';

export const smtpTransporterFactory: FactoryProvider<
  Transporter<SMTPTransport.SentMessageInfo>
> = {
  provide: SMTP_TRANSPORTER_INSTANCE,
  useFactory(
    configService: ConfigService<NotificationServiceConfig>,
  ) {
    const fromEmail = configService.get('FROM_EMAIL');

    return createTransport(
      {
        authMethod: 'LOGIN',
        host: configService.get('SMTP_HOST'),
        port: configService.get('SMTP_PORT'),
        secure: false,
        auth: {
          user: configService.get('SMTP_USERNAME'),
          pass: configService.get('SMTP_PASSWORD'),
        },
      },
      {
        sender: fromEmail,
        from: `Complex reservation - <${fromEmail}>`,
        subject: 'Complex reservation notification',
      },
    );
  },
  inject: [ConfigService],
};
