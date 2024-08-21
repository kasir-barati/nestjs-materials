import { SinonMock, SinonMockType } from '@app/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceController', () => {
  let controller: NotificationServiceController;
  let service: SinonMockType<NotificationServiceService>;

  beforeEach(async () => {
    service = SinonMock.of(NotificationServiceService);
    controller = new NotificationServiceController(service);
  });

  it('should return "Hello World!"', () => {
    expect(controller.getHello()).toBe('Hello World!');
  });
});
