import { RmqOptions } from '@nestjs/microservices';

/**
 *
 * @param {object} queueConf
 * @param queueConf.messageTtl set message time to live in milliseconds (e.g. 1min = 60,000)
 * @param queueConf.dlq notification dead letters should be routed to the this DLQ.
 */
export function getNotificationQueueOptions({
  dlq,
  messageTtl,
}: {
  dlq: string;
  messageTtl: number;
}): RmqOptions['options']['queueOptions'] {
  return {
    messageTtl,
    // Setup the DLX to point to the default exchange.
    deadLetterExchange: '',
    deadLetterRoutingKey: dlq,
    // Maximum number of messages: https://github.com/amqp-node/amqplib/blob/64d1c1ec19afa64a7ec5c355ea7620f0b227fb30/lib/api_args.js#L59
    maxLength: 13,
  };
}
