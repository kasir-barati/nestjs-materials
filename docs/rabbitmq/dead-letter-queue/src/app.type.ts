import { IsInt, IsMongoId, IsOptional } from 'class-validator';

export enum NodeEnv {
  test = 'test',
  production = 'production',
  development = 'development',
}

export interface AppConfig {
  NODE_ENV: NodeEnv;
  RABBITMQ_URL: string;
}

export type Constructor<T = any> = new (...args: any[]) => T;

function RetryMixin<Base extends Constructor>(base: Base) {
  class Retry extends base {
    @IsOptional()
    @IsInt()
    retryCount?: number;
  }

  return Retry;
}

export class DriverVerificationRequestPayload {
  @IsMongoId()
  driverId: string;
}

class DriverVerificationRequestResponsePayloadClass {
  @IsMongoId()
  driverId: string;

  @IsMongoId()
  verificationId: string;
}

export const DriverVerificationRequestResponsePayload = RetryMixin(
  DriverVerificationRequestResponsePayloadClass,
);
