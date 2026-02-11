import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { AppConfig, LogLevel, LogMode, NodeEnv } from '../app.type';
import { validateEnv } from '../utils/validate-env.util';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppConfig {}
  }
}

export const appConfigs = registerAs('appConfigs', (): AppConfig => {
  const validatedEnvs = validateEnv(process.env, EnvironmentVariables);

  return validatedEnvs;
});

class EnvironmentVariables implements AppConfig {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsString()
  RABBITMQ_URL: string;

  @IsIn(['JSON', 'PLAIN_TEXT'])
  LOG_MODE: LogMode;

  @IsIn(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
  LOG_LEVEL: LogLevel;

  @IsInt()
  @Min(1)
  RABBITMQ_PREFETCH_COUNT: number;

  @IsInt()
  @Min(1)
  RABBITMQ_MAX_RETRY_COUNT: number;
}
