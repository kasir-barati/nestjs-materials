import { NodeEnv } from '@app/common';

export interface AuthApiConfig {
  AUTH_API_PORT: number;
  SWAGGER_PATH: string;
  DATABASE_URL: string;
  MONGO_INITDB_DATABASE: string;
  NODE_ENV: NodeEnv;
}
