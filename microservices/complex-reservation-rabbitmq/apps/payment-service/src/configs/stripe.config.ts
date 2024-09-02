import { isTestEnv } from '@app/common';
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
    const NODE_ENV = paymentServiceConfigs.get('NODE_ENV');
    const stripeConfig: Stripe.StripeConfig = {
      apiVersion: '2024-06-20',
    };

    if (isTestEnv(NODE_ENV)) {
      stripeConfig.port = 1080;
      stripeConfig.host = 'mockserver';
      stripeConfig.protocol = 'http';
      stripeConfig.telemetry = false;
    }

    return new Stripe(
      paymentServiceConfigs.get('STRIPE_SECRET_KEY'),
      stripeConfig,
    );
  },
  inject: [ConfigService],
};
