import { NodeEnv, validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { AuditLogApiConfig } from '../audit-log.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AuditLogApiConfig {}
  }
}

export default registerAs(
  'auditLogApiConfigs',
  (): AuditLogApiConfig => {
    const validatedEnvs = validateEnv(
      process.env,
      EnvironmentVariables,
    );

    return validatedEnvs;
  },
);

class EnvironmentVariables implements AuditLogApiConfig {
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
  AUDIT_LOG_API_PORT: number;

  @IsString()
  SWAGGER_PATH: string;
}
