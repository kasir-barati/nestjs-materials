export interface ReservationServiceConfig {
  SWAGGER_PATH: string;
  AUTH_QUEUE: string;
  PAYMENT_QUEUE: string;
  NOTIFICATION_QUEUE: string;
  NOTIFICATION_TTL: number;
  NOTIFICATION_DLQ: string;
  RABBITMQ_URI: string;
  RESERVATION_SERVICE_PORT: number;
  DATABASE_URL: string;
  MONGO_INITDB_DATABASE: string;
}
