import { NodeEnv } from '@app/common';

export interface AuditLogApiConfig {
  AUDIT_LOG_API_PORT: number;
  SWAGGER_PATH: string;
  RABBITMQ_URL: string;
  NODE_ENV: NodeEnv;
  MONGO_INITDB_DATABASE: string;
  DATABASE_URL: string;
}
