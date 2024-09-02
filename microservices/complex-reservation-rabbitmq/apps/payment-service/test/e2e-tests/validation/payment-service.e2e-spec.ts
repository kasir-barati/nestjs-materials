import {
  ChargeMicroservicesPayload,
  generateRandomString,
  MESSAGE_PATTERN_FOR_CHARGING_USER,
} from '@app/common';
import {
  generateRabbitMqUrl,
  MockserverDriver,
  RabbitMqDriver,
  sleep,
} from '@app/testing';
import { Channel } from 'amqplib';

describe('Payment service (e2e -- validation)', () => {
  let rabbitMqDriver: RabbitMqDriver;
  let mockserverDriver: MockserverDriver;
  let channel: Channel;
  const { PAYMENT_QUEUE, RABBITMQ_URI } = process.env;

  beforeAll(async () => {
    mockserverDriver = new MockserverDriver();
    const rabbitMqUrl = generateRabbitMqUrl(RABBITMQ_URI);
    rabbitMqDriver = new RabbitMqDriver({
      queueName: PAYMENT_QUEUE,
      rabbitMqUrl,
    });
    channel = await rabbitMqDriver.getChannel();
  });
  afterAll(async () => {
    await rabbitMqDriver.cleanup();
  });
  afterEach(async () => {
    await mockserverDriver.cleanup();
  });

  it.each<Partial<ChargeMicroservicesPayload>>([
    { amount: 60_013 },
    {
      amount: 'asdad' as unknown as number,
      token: 8239.123 as unknown as string,
    },
    { token: `tok_${generateRandomString()}` },
  ])(
    'should not send invalid data: %p',
    async (junkData) => {
      // Arrange
      await mockserverDriver.mockResponse({
        httpRequest: {
          method: 'POST',
          path: '/v1/payment_intents',
        },
      });

      // Act
      channel.sendToQueue(
        PAYMENT_QUEUE,
        Buffer.from(
          JSON.stringify({
            data: junkData,
            pattern: MESSAGE_PATTERN_FOR_CHARGING_USER,
          }),
        ),
      );
      await sleep();

      // Assert
      expect(
        await mockserverDriver.verifyRequestWasNotReceived({
          method: 'POST',
          path: '/v1/payment_intents',
        }),
      ).toBeTruthy();
    },
    20_000,
  );
});
