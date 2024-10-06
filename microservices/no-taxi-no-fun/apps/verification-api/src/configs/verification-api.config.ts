import { NodeEnv, validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { VerificationApiConfig } from '../verification-api.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends VerificationApiConfig {}
  }
}

export default registerAs(
  'verificationApiConfigs',
  (): VerificationApiConfig => {
    const validatedEnvs = validateEnv(
      process.env,
      EnvironmentVariables,
    );

    return validatedEnvs;
  },
);

class EnvironmentVariables implements VerificationApiConfig {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsString()
  MONGO_INITDB_DATABASE: string;

  @IsString()
  DATABASE_URL: string;

  @IsInt()
  VERIFICATION_API_PORT: number;

  @IsString()
  SWAGGER_PATH: string;

  @IsString()
  RABBITMQ_URL: string;
}
