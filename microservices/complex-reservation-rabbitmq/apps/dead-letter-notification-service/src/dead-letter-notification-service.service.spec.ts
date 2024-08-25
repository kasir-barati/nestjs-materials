import {
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { DeadLetterNotificationServiceService } from './dead-letter-notification-service.service';
import { DeadLetterNotificationServiceConfig } from './dead-letter-notification-service.type';
import { FailedEmailRepository } from './repositories/failed-email.repository';

describe('DeadLetterNotificationServiceService', () => {
  let service: DeadLetterNotificationServiceService;
  let deadLetterNotificationServiceConfigs: SinonMockType<DeadLetterNotificationServiceConfig>;
  let notificationServiceClient: SinonMockType<ClientProxy>;
  let failedEmailRepository: FailedEmailRepository;
  let channel: SinonMockType<Channel>;
  let message: SinonMockType<Message>;

  beforeEach(async () => {
    channel = SinonMock.with<Channel>({});
    message = SinonMock.with<Message>({});
    failedEmailRepository = SinonMock.of(FailedEmailRepository);
    notificationServiceClient = SinonMock.with<ClientProxy>({});
    deadLetterNotificationServiceConfigs =
      SinonMock.with<DeadLetterNotificationServiceConfig>({
        MAX_RETRY_COUNT: 4,
      });
    service = new DeadLetterNotificationServiceService(
      deadLetterNotificationServiceConfigs,
      notificationServiceClient,
      failedEmailRepository,
    );
  });

  it.each<EmailNotificationMicroservicesPayload>([
    { email: 'rope@hop.joy', html: '<p>test</p>' },
    { email: 'rock@scissors.paper', text: 'Temp', retryCount: 2 },
  ])('should send email notification!', async (data) => {
    const retryCount = (data?.retryCount ?? 0) + 1;

    await service.sendEmailNotification(data, channel, message);

    expect(
      notificationServiceClient.emit.calledWith(
        EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
        { ...data, retryCount },
      ),
    ).toBeTruthy();
    expect(channel.ack.calledWith(message)).toBeTruthy();
  });
});
