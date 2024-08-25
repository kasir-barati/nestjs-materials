export interface DeadLetterNotificationServiceConfig {
  NOTIFICATION_QUEUE: string;
  NOTIFICATION_DLQ: string;
  RABBITMQ_URI: string;
  MAX_RETRY_COUNT: number;
  MONGO_INITDB_DATABASE: string;
  DATABASE_URL: string;
}
