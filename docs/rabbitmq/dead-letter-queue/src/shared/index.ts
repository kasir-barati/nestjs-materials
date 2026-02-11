export interface GenericUserEvent<TUserInfo = any> {
  messageId: string;
  userInfo: TUserInfo;
}
export const EVENTS_EXCHANGE = 'events';
export const EVENTS_EXCHANGE_TYPE = 'topic';
export const DLQ_FOR_EVENTS_QUEUE = 'events-dlq';
export const EXCHANGE_OF_DLQ_FOR_EVENTS_QUEUE = 'events.dlx';
export const EXCHANGE_TYPE_OF_DLQ_FOR_EVENTS_QUEUE = 'topic';
/** @description Cannot have multiple routing key for DLQ */
export const ROUTING_KEY_OF_DLQ_FOR_EVENTS_QUEUE = 'events.dead-letter';
