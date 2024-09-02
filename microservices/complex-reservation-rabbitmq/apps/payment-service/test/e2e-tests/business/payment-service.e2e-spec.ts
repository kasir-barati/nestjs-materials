import {
  ChargeMicroservicesPayload,
  MESSAGE_PATTERN_FOR_CHARGING_USER,
} from '@app/common';
import {
  generateRabbitMqUrl,
  MockserverDriver,
  RabbitMqDriver,
  sleep,
} from '@app/testing';
import { Channel } from 'amqplib';
import { createPaymentIntentsResponseBody } from '../../mock-data/payment-intents-response.mock-data';

describe('Payment service (e2e -- business)', () => {
  let rabbitMqDriver: RabbitMqDriver;
  let mockserverDriver: MockserverDriver;
  let channel: Channel;
  const { PAYMENT_QUEUE, RABBITMQ_URI } = process.env;

  beforeEach(async () => {
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

  it.each<ChargeMicroservicesPayload>([
    { amount: 60_013, token: 'pm_card_visa' },
    {
      amount: 12312,
      token: 'pm_card_mastercard_debit',
    },
  ])(
    'should create the payment: %p',
    async (data) => {
      // Arrange
      await mockserverDriver.mockResponse({
        httpRequest: {
          method: 'POST',
          path: '/v1/payment_intents',
        },
        httpResponse: {
          statusCode: 200,
          body: createPaymentIntentsResponseBody(data.amount),
        },
      });

      // Act
      channel.sendToQueue(
        PAYMENT_QUEUE,
        Buffer.from(
          JSON.stringify({
            data,
            pattern: MESSAGE_PATTERN_FOR_CHARGING_USER,
          }),
        ),
      );
      await sleep();

      // Assert
      expect(
        await mockserverDriver.verifyRequestWasReceived({
          method: 'POST',
          path: '/v1/payment_intents',
        }),
      ).toBeTruthy();
    },
    20_000,
  );
});
