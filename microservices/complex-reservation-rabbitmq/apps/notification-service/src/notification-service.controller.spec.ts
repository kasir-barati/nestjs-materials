import {
  EmailNotificationMicroservicesPayload,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';

describe('NotificationServiceController', () => {
  let controller: NotificationServiceController;
  let service: SinonMockType<NotificationServiceService>;

  beforeEach(async () => {
    jest.clearAllMocks();
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
      const mockAck = jest.fn();
      const rmqContext = SinonMock.of(RmqContext, {
        getChannelRef: jest.fn(() => ({ ack: mockAck })),
      });
      service.sendEmailNotification.withArgs(data).resolves(true);

      const isSent = await controller.sendEmailNotification(
        data,
        rmqContext,
      );

      expect(mockAck).toHaveBeenCalledTimes(1);
      expect(isSent).toBeTruthy();
    },
  );

  it('should return false after failing to send email', async () => {
    const mockAck = jest.fn();
    const rmqContext = SinonMock.of(RmqContext, {
      getChannelRef: jest.fn(() => ({ ack: mockAck })),
    });
    service.sendEmailNotification.resolves(false);

    const isSent = await controller.sendEmailNotification(
      {
        email: 'hero@her.sp',
        text: 'Lorem.',
      },
      rmqContext,
    );

    expect(mockAck).toHaveBeenCalledTimes(0);
    expect(isSent).toBeFalsy();
  });
});
