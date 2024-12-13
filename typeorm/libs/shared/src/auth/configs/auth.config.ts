import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateEnvs } from '../../utils/validate.utils';
import { AuthConfig } from '../auth.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AuthConfig {}
  }
}

export default registerAs('authConfigs', (): AuthConfig => {
  const validatedEnvs = validateEnvs(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements AuthConfig {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;
}
