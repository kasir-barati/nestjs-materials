import { NodeEnv } from '@app/common';

export enum StripeEnv {
  test = 'test',
  production = 'production',
  development = 'development',
}

export interface PaymentServiceConfig {
  PAYMENT_QUEUE: string;
  RABBITMQ_URI: string;
  STRIPE_SECRET_KEY: string;
  NODE_ENV?: NodeEnv;
  STRIPE_ENV: StripeEnv;
}
