import { ChargeMicroservicesPayload } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_INSTANCE } from './constants/stripe.constant';

@Injectable()
export class PaymentServiceService {
  constructor(
    @Inject(STRIPE_INSTANCE)
    private readonly stripe: Stripe,
  ) {}

  async charge({
    token,
    amount,
  }: ChargeMicroservicesPayload): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      confirm: true,
      currency: 'JPY',
      payment_method: token,
      return_url: 'https://example.cn', // TODO: Should be sent by client-side app? or from .env? or from the client service in backend? IDK.
    });

    return paymentIntent;
  }
}
