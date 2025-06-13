import { validateEnv } from '@grpc/shared';
import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { NotificationRabbitmqConfig } from '../types/rabbitmq.type';

declare global {
   
  namespace NodeJS {
     
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
