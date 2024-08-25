import {
  generateRandomString,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { DeadLetterNotificationServiceController } from './dead-letter-notification-service.controller';
import { DeadLetterNotificationServiceService } from './dead-letter-notification-service.service';

describe('DeadLetterNotificationServiceController', () => {
  let controller: DeadLetterNotificationServiceController;
  let service: SinonMockType<DeadLetterNotificationServiceService>;
  let context: SinonMockType<RmqContext>;

  beforeEach(async () => {
    context = SinonMock.of(RmqContext);
    service = SinonMock.of(DeadLetterNotificationServiceService);
    controller = new DeadLetterNotificationServiceController(service);
  });

  it('should send email notification', async () => {
    let data = {
      email: generateRandomString() + '@gmail.com',
      text: generateRandomString(),
      retryCount: 3,
    };
    service.sendEmailNotification.resolves();

    await controller.sendEmailNotification(data, context);

    expect(service.sendEmailNotification.callCount).toBe(1);
  });
});
