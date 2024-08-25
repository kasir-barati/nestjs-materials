import {
  EmailNotificationMicroservicesPayload,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { Channel, Message } from 'amqplib';
import { Transporter } from 'nodemailer';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceService', () => {
  let service: NotificationServiceService;
  let transporter: SinonMockType<Transporter>;
  let channel: SinonMockType<Channel>;
  let message: SinonMockType<Message>;

  beforeEach(async () => {
    channel = SinonMock.with<Channel>({});
    message = SinonMock.with<Message>({});
    transporter = SinonMock.with<Transporter>({});
    service = new NotificationServiceService(transporter);
  });

  it.each<EmailNotificationMicroservicesPayload>([
    { email: 'some@bom.cp', html: '<p>test</p>' },
    { email: 'come@raw.eu', text: 'Plain test' },
  ])('should send email notification', async (data) => {
    const { email, ...rest } = data;
    transporter.sendMail.resolves();

    await service.sendEmailNotification(data, channel, message);

    expect(
      transporter.sendMail.calledWith({
        to: email,
        ...rest,
      }),
    ).toBeTruthy();
    expect(channel.ack.calledWith(message)).toBeTruthy();
  });

  it('should reject message on failing to send email', async () => {
    transporter.sendMail.rejects();

    await service.sendEmailNotification(
      {
        email: 'clergy@gorge.de',
        text: 'Test.',
      },
      channel,
      message,
    );

    expect(channel.reject.calledWith(message)).toBeTruthy();
  });
});
