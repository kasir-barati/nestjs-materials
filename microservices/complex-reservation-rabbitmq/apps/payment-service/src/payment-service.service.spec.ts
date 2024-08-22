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
  const mockedPaymentMethodsCreate = jest.fn(() =>
    Promise.resolve({ id: 'payment method id' }),
  );
  const mockedPaymentIntentsCreate = jest.fn();

  beforeEach(async () => {
    stripe = SinonMock.of<Stripe>(Stripe, {
      paymentMethods: {
        create: mockedPaymentMethodsCreate,
      },
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
    });
  });

  it('should propagate errors on paymentMethods.create', async () => {
    mockedPaymentMethodsCreate.mockRejectedValue(new Error());

    const result = service.charge({
      amount: 9000,
      token: 'pm_card_amex',
    });

    await expect(result).rejects.toThrowError(new Error());
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
