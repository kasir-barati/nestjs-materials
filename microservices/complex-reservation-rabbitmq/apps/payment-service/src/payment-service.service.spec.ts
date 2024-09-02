import { ChargeMicroservicesPayload } from '@app/common';
import { SinonMock, SinonMockType } from '@app/testing';
import { Channel, Message } from 'amqplib';
import Stripe from 'stripe';
import { PaymentServiceService } from './payment-service.service';

describe('PaymentServiceController', () => {
  let stripe: SinonMockType<Stripe>;
  let service: PaymentServiceService;
  const mockedPaymentIntentsCreate = jest.fn();
  let channel: SinonMockType<Channel>;
  let message: SinonMockType<Message>;

  beforeEach(async () => {
    jest.clearAllMocks();
    channel = SinonMock.with<Channel>({
      ack: jest.fn(),
    });
    message = SinonMock.with<Message>({});
    stripe = SinonMock.of<Stripe>(Stripe, {
      paymentIntents: { create: mockedPaymentIntentsCreate },
    });
    service = new PaymentServiceService(stripe);
  });

  it.each<ChargeMicroservicesPayload>([
    {
      amount: 1000,
      token: 'pm_card_unionpay',
    },
    {
      amount: 9000,
      token: 'pm_card_jcb',
    },
  ])('should charge $amount', async (data) => {
    await service.charge({ payload: data, channel, message });

    expect(mockedPaymentIntentsCreate).toHaveBeenCalledWith({
      amount: data.amount,
      confirm: true,
      currency: 'JPY',
      payment_method: data.token,
      return_url: expect.any(String),
    });
  });

  it('should propagate errors on paymentIntents.create', async () => {
    mockedPaymentIntentsCreate.mockRejectedValue(new Error());

    const result = service.charge({
      channel,
      message,
      payload: { amount: 9000, token: 'pm_card_mastercard' },
    });

    await expect(result).rejects.toThrowError(new Error());
  });
});
