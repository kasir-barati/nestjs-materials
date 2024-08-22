export interface PaymentServiceConfig {
  PAYMENT_QUEUE: string;
  RABBITMQ_URI: string;
  STRIPE_SECRET_KEY: string;
}
