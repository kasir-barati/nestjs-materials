import { validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { NotificationServiceConfig } from '../notification-service.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends NotificationServiceConfig {}
  }
}

export default registerAs(
  'notificationServiceConfigs',
  (): NotificationServiceConfig => {
    const validatedEnvs = validateEnv(
      process.env,
      EnvironmentVariables,
    );

    return validatedEnvs;
  },
);

class EnvironmentVariables implements NotificationServiceConfig {
  @IsEmail()
  FROM_EMAIL: string;

  @IsInt()
  TCP_PORT: number;

  @IsString()
  SMTP_HOST: string;

  @IsInt()
  SMTP_PORT: number;

  @IsString()
  SMTP_USERNAME: string;

  @IsString()
  SMTP_PASSWORD: string;
}
