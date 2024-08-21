import { validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ReservationServiceConfig } from '../reservation-service.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ReservationServiceConfig {}
  }
}

export default registerAs(
  'reservationServiceConfigs',
  (): ReservationServiceConfig => {
    const validatedEnvs = validateEnv(
      process.env,
      EnvironmentVariables,
    );

    return validatedEnvs;
  },
);

class EnvironmentVariables implements ReservationServiceConfig {
  @IsOptional()
  @IsString()
  SWAGGER_PATH: string = 'docs';

  @IsString()
  AUTH_HOST: string;

  @IsInt()
  AUTH_TCP_PORT: number;

  @IsString()
  PAYMENT_HOST: string;

  @IsInt()
  PAYMENT_TCP_PORT: number;

  @IsInt()
  RESERVATION_SERVICE_PORT: number;
}
