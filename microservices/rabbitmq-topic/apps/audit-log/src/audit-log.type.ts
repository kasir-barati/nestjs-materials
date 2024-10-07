import { NodeEnv } from '@app/common';

export interface AuditLogApiConfig {
  AUDIT_LOG_API_PORT: number;
  NODE_ENV: NodeEnv;
  MONGO_INITDB_DATABASE: string;
  SWAGGER_PATH: string;
  DATABASE_URL: string;
  RABBITMQ_URL: string;
}
