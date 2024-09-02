import { NodeEnv, validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentServiceConfig } from '../payment-service.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends PaymentServiceConfig {}
  }
}

export default registerAs(
  'paymentServiceConfigs',
  (): PaymentServiceConfig => {
    const validatedEnvs = validateEnv(
      process.env,
      EnvironmentVariables,
    );

    return validatedEnvs;
  },
);

class EnvironmentVariables implements PaymentServiceConfig {
  @IsString()
  STRIPE_SECRET_KEY: string;

  @IsString()
  PAYMENT_QUEUE: string;

  @IsString()
  RABBITMQ_URI: string;

  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.development;
}
