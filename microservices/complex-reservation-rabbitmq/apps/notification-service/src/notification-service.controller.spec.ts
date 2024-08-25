import {
  EmailNotificationMicroservicesPayload,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { RmqContext } from '@nestjs/microservices';
import * as Sinon from 'sinon';
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
  ])('should send email: %p', async (data) => {
    const rmqContext = SinonMock.of(RmqContext);
    service.sendEmailNotification.resolves();

    await controller.sendEmailNotification(data, rmqContext);

    expect(
      service.sendEmailNotification.calledWith(
        data,
        Sinon.match.any,
        Sinon.match.any,
      ),
    ).toBeTruthy();
  });

  it('should fail to send email', async () => {
    const mockAck = jest.fn();
    const rmqContext = SinonMock.of(RmqContext, {
      getChannelRef: jest.fn(() => ({ ack: mockAck })),
    });
    service.sendEmailNotification.resolves();

    await controller.sendEmailNotification(
      {
        email: 'hero@her.sp',
        text: 'Lorem.',
      },
      rmqContext,
    );

    expect(mockAck).toHaveBeenCalledTimes(0);
  });
});
