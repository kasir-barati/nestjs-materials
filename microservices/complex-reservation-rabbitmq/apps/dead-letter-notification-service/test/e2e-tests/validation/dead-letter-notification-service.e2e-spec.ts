import {
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
} from '@app/common';
import {
  generateRabbitMqUrl,
  MailCatcherDriver,
  RabbitMqDriver,
  sleep,
} from '@app/testing';
import { Channel } from 'amqplib';

describe('Dead letter notification service (e2e - validation)', () => {
  let mailCatcherDriver: MailCatcherDriver;
  let rabbitMqDriver: RabbitMqDriver;
  let channel: Channel;
  const { NOTIFICATION_DLQ, RABBITMQ_URI } = process.env;

  beforeAll(async () => {
    const rabbitMqUrl = generateRabbitMqUrl(RABBITMQ_URI);
    mailCatcherDriver = new MailCatcherDriver();
    rabbitMqDriver = new RabbitMqDriver({
      queueName: NOTIFICATION_DLQ,
      rabbitMqUrl,
    });
    channel = await rabbitMqDriver.getChannel();
  });
  afterAll(async () => {
    await rabbitMqDriver.cleanup();
  });

  it.each<EmailNotificationMicroservicesPayload>([
    { email: 'junk-mail', html: '<span>Ooops</span>' },
    { email: 'mail@temp.eu' },
  ])(
    'should not send email when published message in the queue is junk data: %p',
    async (junkData) => {
      channel.sendToQueue(
        NOTIFICATION_DLQ,
        Buffer.from(
          JSON.stringify({
            data: junkData,
            pattern: EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
          }),
        ),
      );

      await sleep();

      const message = await mailCatcherDriver.getMail(junkData.email);

      expect(message).toBeUndefined();
    },
    20000,
  );
});
