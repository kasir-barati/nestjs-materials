import { validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsInt, IsString } from 'class-validator';
import { DeadLetterNotificationServiceConfig } from '../dead-letter-notification-service.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv
      extends DeadLetterNotificationServiceConfig {}
  }
}

export default registerAs(
  'deadLetterNotificationServiceConfigs',
  (): DeadLetterNotificationServiceConfig => {
    const validatedEnvs = validateEnv(
      process.env,
      EnvironmentVariables,
    );

    return validatedEnvs;
  },
);

class EnvironmentVariables
  implements DeadLetterNotificationServiceConfig
{
  @IsString()
  NOTIFICATION_QUEUE: string;

  @IsInt()
  NOTIFICATION_TTL: number;

  @IsString()
  NOTIFICATION_DLQ: string;

  @IsString()
  RABBITMQ_URI: string;

  @IsInt()
  MAX_RETRY_COUNT: number;

  @IsString()
  MONGO_INITDB_DATABASE: string;

  @IsString()
  DATABASE_URL: string;
}
