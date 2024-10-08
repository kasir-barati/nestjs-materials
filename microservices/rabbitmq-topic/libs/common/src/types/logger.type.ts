export interface RabbitmqErrorLogger {
  queue: string;
  message: string;
  exchange: string;
  payload: unknown;
  routingKey?: string;
}
