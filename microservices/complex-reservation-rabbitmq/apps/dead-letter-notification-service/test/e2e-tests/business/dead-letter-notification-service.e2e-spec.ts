import {
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
  generateRandomString,
} from '@app/common';
import {
  generateRabbitMqUrl,
  MailCatcherDriver,
  RabbitMqDriver,
  sleep,
} from '@app/testing';
import { Channel } from 'amqplib';

describe('Notification service (e2e - business)', () => {
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
    {
      email: `${generateRandomString()}@life.pi`,
      html: '<span>Sharp</span>',
    },
    {
      email: `${generateRandomString()}@monday.cpu`,
      text: 'RAM, CPU',
    },
  ])(
    'should be able to send email: %p',
    async (data) => {
      channel.sendToQueue(
        NOTIFICATION_DLQ,
        Buffer.from(
          JSON.stringify({
            data,
            pattern: EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
          }),
        ),
      );

      await sleep();

      const message = await mailCatcherDriver.getMail(data.email);

      expect(message).toBeDefined();
    },
    20000,
  );
});
