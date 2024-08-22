import {
  EmailNotificationMicroservicesPayload,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { Transporter } from 'nodemailer';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceService', () => {
  let service: NotificationServiceService;
  let transporter: SinonMockType<Transporter>;

  beforeEach(async () => {
    transporter = SinonMock.with<Transporter>({});
    service = new NotificationServiceService(transporter);
  });

  it.each<EmailNotificationMicroservicesPayload>([
    { email: 'some@bom.cp', html: '<p>test</p>' },
    { email: 'come@raw.eu', text: 'Plain test' },
  ])('should send email notification', async (data) => {
    const { email, ...rest } = data;
    transporter.sendMail.resolves(true);

    const isSent = await service.sendEmailNotification(data);

    expect(
      transporter.sendMail.calledWith({
        to: email,
        ...rest,
      }),
    ).toBeTruthy();
    expect(isSent).toBeTruthy();
  });

  it('should return false in case of failing to send email', async () => {
    transporter.sendMail.rejects(false);

    const isSent = await service.sendEmailNotification({
      email: 'clergy@gorge.de',
      text: 'Test.',
    });

    expect(isSent).toBeFalsy();
  });
});
