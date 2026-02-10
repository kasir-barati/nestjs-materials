import { registerAs } from '@nestjs/config';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { AppConfig, NodeEnv } from '../app.type';
import { validateEnv } from '../utils/validate-env.util';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppConfig {}
  }
}

export default registerAs('appConfigs', (): AppConfig => {
  const validatedEnvs = validateEnv(process.env, EnvironmentVariables);

  return validatedEnvs;
});

class EnvironmentVariables implements AppConfig {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsString()
  RABBITMQ_URL: string;
}
