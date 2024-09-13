import { NodeEnv } from '@app/common';

export interface DriverApiConfig {
  DRIVER_API_PORT: number;
  SWAGGER_PATH: string;
  DATABASE_URL: string;
  MONGO_INITDB_DATABASE: string;
  RABBITMQ_URL: string;
  NODE_ENV: NodeEnv;
}
