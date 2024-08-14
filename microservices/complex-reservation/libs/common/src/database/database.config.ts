import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateEnv } from '../utils/validate-env.util';
import { DatabaseConfig } from './database.type';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends DatabaseConfig {}
  }
}

export default registerAs('databaseConfigs', (): DatabaseConfig => {
  const validatedEnvs = validateEnv(
    process.env,
    EnvironmentVariables,
  );

  return validatedEnvs;
});

class EnvironmentVariables implements DatabaseConfig {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  MONGO_INITDB_DATABASE: string;
}
