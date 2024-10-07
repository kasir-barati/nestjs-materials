import { NodeEnv, validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { DriverApiConfig } from '../driver-api.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends DriverApiConfig {}
  }
}

export default registerAs('driverApiConfigs', (): DriverApiConfig => {
  const validatedEnvs = validateEnv(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements DriverApiConfig {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv;

  @IsString()
  RABBITMQ_URL: string;

  @IsString()
  MONGO_INITDB_DATABASE: string;

  @IsString()
  DATABASE_URL: string;

  @IsInt()
  DRIVER_API_PORT: number;

  @IsString()
  SWAGGER_PATH: string;
}
