import {
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
  generateRandomString,
} from '@app/common';
import {
  generateRabbitMqUrl,
  RabbitMqDriver,
  sleep,
} from '@app/testing';
import { Channel } from 'amqplib';
import { getMail } from '../../utils/get-mail.util';

describe('Notification service (e2e - validation)', () => {
  let rabbitMqDriver: RabbitMqDriver;
  let channel: Channel;
  const {
    NOTIFICATION_QUEUE,
    NOTIFICATION_DLQ,
    RABBITMQ_URI,
    NOTIFICATION_TTL,
  } = process.env;

  beforeAll(async () => {
    const rabbitMqUrl = generateRabbitMqUrl(RABBITMQ_URI);
    rabbitMqDriver = new RabbitMqDriver({
      queueName: NOTIFICATION_QUEUE,
      rabbitMqUrl,
    });
    channel = await rabbitMqDriver.getChannel({
      maxLength: 13,
      messageTtl: Number(NOTIFICATION_TTL),
      deadLetterExchange: '',
      deadLetterRoutingKey: NOTIFICATION_DLQ,
    });
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
    'should send be able to receive and process this data: %p',
    async (data) => {
      channel.sendToQueue(
        NOTIFICATION_QUEUE,
        Buffer.from(
          JSON.stringify({
            data,
            pattern: EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
          }),
        ),
      );

      await sleep();

      const message = await getMail(data.email);

      expect(message).toBeDefined();
    },
    20000,
  );

  it.each<EmailNotificationMicroservicesPayload>([
    { email: 'junk-mail', html: '<span>Ooops</span>' },
    { email: 'mail@temp.eu' },
  ])(
    'should not send email when published message in the queue is junk data: %p',
    async (junkData) => {
      channel.sendToQueue(
        NOTIFICATION_QUEUE,
        Buffer.from(
          JSON.stringify({
            data: junkData,
            pattern: EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
          }),
        ),
      );

      await sleep();

      const message = await getMail(junkData.email);

      expect(message).toBeUndefined();
    },
    20000,
  );
});
