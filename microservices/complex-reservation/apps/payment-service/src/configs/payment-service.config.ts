import { validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsInt, IsString } from 'class-validator';
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

  @IsInt()
  TCP_PORT: number;
}
