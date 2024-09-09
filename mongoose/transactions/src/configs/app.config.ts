import { registerAs } from '@nestjs/config';
import { IsInt, IsString } from 'class-validator';
import { AppConfig } from '../app.type';
import { validateEnv } from '../utils/validate-env.util';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppConfig {}
  }
}

export default registerAs('appConfigs', (): AppConfig => {
  const validatedEnvs = validateEnv<EnvironmentVariables>(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements AppConfig {
  @IsInt()
  PORT: number;

  @IsString()
  SWAGGER_PATH: string;

  @IsString()
  MONGO_INITDB_DATABASE: string;

  @IsString()
  DATABASE_URL: string;
}
