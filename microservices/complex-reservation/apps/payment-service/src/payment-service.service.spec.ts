import {
  ChargeMicroservicesPayload,
  SinonMock,
  SinonMockType,
} from '@app/common';
import Stripe from 'stripe';
import { PaymentServiceService } from './payment-service.service';

describe('PaymentServiceController', () => {
  let stripe: SinonMockType<Stripe>;
  let service: PaymentServiceService;
  const mockedPaymentIntentsCreate = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
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
    await service.charge(data);

    expect(mockedPaymentIntentsCreate).toHaveBeenCalledWith({
      amount: data.amount,
      confirm: true,
      currency: 'JPY',
      payment_method: data.token,
      return_url: 'https://example.cn',
    });
  });

  it('should propagate errors on paymentIntents.create', async () => {
    mockedPaymentIntentsCreate.mockRejectedValue(new Error());

    const result = service.charge({
      amount: 9000,
      token: 'pm_card_mastercard',
    });

    await expect(result).rejects.toThrowError(new Error());
  });
});
