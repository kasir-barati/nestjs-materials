export interface ReservationServiceConfig {
  SWAGGER_PATH: string;
  AUTH_HOST: string;
  AUTH_TCP_PORT: number;
  PAYMENT_HOST: string;
  PAYMENT_TCP_PORT: number;
  NOTIFICATION_HOST: string;
  NOTIFICATION_TCP_PORT: number;
  RESERVATION_SERVICE_PORT: number;
}
