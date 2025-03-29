import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { AppConfig } from '../types';
import { validateEnv } from '../utils';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppConfig {}
  }
}

export const appConfig = registerAs('appConfigs', (): AppConfig => {
  const validatedEnvs = validateEnv(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements AppConfig {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  PORT = 12301;

  @IsString()
  APP_NAME: string;

  @IsOptional()
  @IsString()
  REDIS_HOST = 'localhost';

  @IsOptional()
  @IsInt()
  REDIS_PORT = 6379;
}
