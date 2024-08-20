import { validateEnv } from '@app/common';
import { registerAs } from '@nestjs/config';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { AuthServiceConfig } from '../auth-service.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AuthServiceConfig {}
  }
}

export default registerAs(
  'authServiceConfigs',
  (): AuthServiceConfig => {
    const validatedEnvs = validateEnv(
      process.env,
      EnvironmentVariables,
    );

    return validatedEnvs;
  },
);

class EnvironmentVariables implements AuthServiceConfig {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;

  @IsOptional()
  @IsString()
  SWAGGER_PATH: string = 'docs';

  @IsInt()
  AUTH_SERVICE_PORT: number;

  @IsInt()
  TCP_PORT: number;
}
