import { ChargeMicroservicesPayload } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib';
import Stripe from 'stripe';
import { STRIPE_INSTANCE } from './constants/stripe.constant';

@Injectable()
export class PaymentServiceService {
  constructor(
    @Inject(STRIPE_INSTANCE)
    private readonly stripe: Stripe,
  ) {}

  async charge({
    payload,
    channel,
    message,
  }: {
    payload: ChargeMicroservicesPayload;
    channel: Channel;
    message: Message;
  }): Promise<Stripe.PaymentIntent> {
    // No need for retry logic
    channel.ack(message);

    const { amount, token } = payload;
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
