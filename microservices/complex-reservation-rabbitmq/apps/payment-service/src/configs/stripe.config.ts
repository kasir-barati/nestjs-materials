import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { STRIPE_INSTANCE } from '../constants/stripe.constant';
import { PaymentServiceConfig } from '../payment-service.type';

export const stripeFactory: FactoryProvider<Stripe> = {
  provide: STRIPE_INSTANCE,
  useFactory(
    paymentServiceConfigs: ConfigService<PaymentServiceConfig>,
  ) {
    return new Stripe(
      paymentServiceConfigs.get('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2024-06-20',
      },
    );
  },
  inject: [ConfigService],
};
