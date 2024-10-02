import { NodeEnv, validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { AuthApiConfig } from '../types/auth.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AuthApiConfig {}
  }
}

export default registerAs('authApiConfigs', (): AuthApiConfig => {
  const validatedEnvs = validateEnv(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements AuthApiConfig {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsString()
  MONGO_INITDB_DATABASE: string;

  @IsString()
  DATABASE_URL: string;

  @IsInt()
  AUTH_API_PORT: number;

  @IsString()
  SWAGGER_PATH: string;
}
