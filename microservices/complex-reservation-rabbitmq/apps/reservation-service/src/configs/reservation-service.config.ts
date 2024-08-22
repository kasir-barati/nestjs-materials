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
  AUTH_QUEUE: string;

  @IsString()
  PAYMENT_QUEUE: string;

  @IsInt()
  RESERVATION_SERVICE_PORT: number;

  @IsString()
  NOTIFICATION_QUEUE: string;

  @IsString()
  RABBITMQ_URI: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  MONGO_INITDB_DATABASE: string;
}
