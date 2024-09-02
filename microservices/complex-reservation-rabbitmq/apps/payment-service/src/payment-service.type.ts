import { NodeEnv } from '@app/common';

export interface PaymentServiceConfig {
  PAYMENT_QUEUE: string;
  RABBITMQ_URI: string;
  STRIPE_SECRET_KEY: string;
  NODE_ENV?: NodeEnv;
}
