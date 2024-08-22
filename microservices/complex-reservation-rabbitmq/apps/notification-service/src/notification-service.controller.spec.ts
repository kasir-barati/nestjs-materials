import {
  EmailNotificationMicroservicesPayload,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceController', () => {
  let controller: NotificationServiceController;
  let service: SinonMockType<NotificationServiceService>;

  beforeEach(async () => {
    service = SinonMock.of(NotificationServiceService);
    controller = new NotificationServiceController(service);
  });

  it.each<EmailNotificationMicroservicesPayload>([
    {
      email: 'joker@role.ir',
      text: 'funny.',
    },
    {
      email: 'hero@her.sp',
      text: 'Lorem.',
    },
  ])(
    'should return true after successful email sending',
    async (data) => {
      service.sendEmailNotification.withArgs(data).resolves(true);

      const isSent = await controller.sendEmailNotification(data);

      expect(isSent).toBeTruthy();
    },
  );
});
