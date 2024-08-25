export interface NotificationServiceConfig {
  NOTIFICATION_DLQ: string;
  NOTIFICATION_QUEUE: string;
  RABBITMQ_URI: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
  FROM_EMAIL: string;
}
