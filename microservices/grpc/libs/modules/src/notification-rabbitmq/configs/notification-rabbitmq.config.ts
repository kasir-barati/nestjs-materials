import { validateEnv } from '@grpc/shared';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { NotificationRabbitmqConfig } from '../types/rabbitmq.type';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line
    interface ProcessEnv extends NotificationRabbitmqConfig {}
  }
}

export default registerAs(
  'notificationRabbitmqConfigs',
  (): NotificationRabbitmqConfig => {
    const validatedEnvs = validateEnv(process.env, EnvironmentVariables);

    return validatedEnvs;
  }
);

class EnvironmentVariables implements NotificationRabbitmqConfig {
  @IsString()
  RABBITMQ_URL: string;
}
