import type { ConsumeMessage } from 'amqplib';

/** @description Use it only inside a consumer. */
export function getDeliveryCount(msg: ConsumeMessage): number {
  return msg.properties.headers?.['x-delivery-count'] ?? 1;
}
