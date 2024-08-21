import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceController', () => {
  let service: NotificationServiceService;

  beforeEach(async () => {
    service = new NotificationServiceService();
  });

  it('should return "Hello World!"', () => {
    expect(service.getHello()).toBe('Hello World!');
  });
});
