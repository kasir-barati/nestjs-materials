import { validateEnv } from '@grpc/shared';
import { registerAs } from '@nestjs/config';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { AppConfig } from '../types/app.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppConfig {}
  }
}

export default registerAs('appConfigs', (): AppConfig => {
  const validatedEnvs = validateEnv(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements AppConfig {
  @IsOptional()
  @IsIn(['development', 'test', 'production'])
  NODE_ENV: 'development' | 'test' | 'production' = 'development';

  @IsString()
  OBJECT_STORAGE_REGION: string;

  @IsString()
  OBJECT_STORAGE_ACCESS_KEY: string;

  @IsString()
  OBJECT_STORAGE_SECRET_KEY: string;

  @IsOptional()
  @IsString()
  OBJECT_STORAGE_ENDPOINT?: string;
}
