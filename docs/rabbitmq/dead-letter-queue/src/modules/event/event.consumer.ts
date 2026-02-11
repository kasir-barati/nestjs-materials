import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

import {
  EVENTS_EXCHANGE,
  EXCHANGE_OF_DLQ_FOR_EVENTS_QUEUE,
  GenericUserEvent,
  ROUTING_KEY_OF_DLQ_FOR_EVENTS_QUEUE,
} from '../../shared';
import { getDeliveryCount } from '../../utils';
import { CustomLoggerService } from '../logger';
import { RabbitmqPolicyService } from '../messaging';
import { EventService } from './event.service';

@Injectable()
export class EventConsumer implements OnModuleInit {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly eventService: EventService,
    private readonly rabbitmqPolicyService: RabbitmqPolicyService,
  ) {}

  async onModuleInit() {
    await this.rabbitmqPolicyService.upsertDeliveryLimitPolicy({
      vhost: '/',
      policyName: 'events-delivery-limit-policy',
      queueNameRegex: '^events-queue$',
      deliveryLimit: 3,
      deadLetterExchange: EXCHANGE_OF_DLQ_FOR_EVENTS_QUEUE,
      deadLetterRoutingKey: ROUTING_KEY_OF_DLQ_FOR_EVENTS_QUEUE,
    });
  }

  @RabbitSubscribe({
    exchange: EVENTS_EXCHANGE,
    routingKey: ['user.*'],
    queue: 'events-queue',
    // Note: The errorHandler is commented out because we're relying on RabbitMQ's built-in x-delivery-count and DLQ mechanism for retries and dead-lettering.
    // errorHandler: (channel, message, _error) => {
    //   const deliveryCount = getDeliveryCount(message);
    //   const maxRetryCount = Number(process.env.RABBITMQ_MAX_RETRY_COUNT) ?? 3;

    //   // eslint-disable-next-line no-console
    //   console.log('=========DELIVERY_COUNT=========', deliveryCount);

    //   if (deliveryCount < maxRetryCount) {
    //     // Requeue the message with incremented x-delivery-count
    //     const { exchange, routingKey } = message.fields;
    //     const headers = {
    //       ...message.properties.headers,
    //       'x-delivery-count': deliveryCount + 1,
    //     };

    //     // Requeue the message!
    //     channel.publish(exchange, routingKey, message.content, {
    //       ...message.properties,
    //       headers,
    //     });

    //     // Acknowledge the original message to prevent redelivery
    //     channel.ack(message);
    //     return;
    //   }

    //   // Reject the message without requeue to send it to DLQ
    //   channel.nack(message, false, false);
    // },
    queueOptions: {
      durable: true,
      arguments: {
        'x-queue-type': 'quorum',
        'x-dead-letter-exchange': EXCHANGE_OF_DLQ_FOR_EVENTS_QUEUE,
        'x-dead-letter-routing-key': ROUTING_KEY_OF_DLQ_FOR_EVENTS_QUEUE,
      },
    },
  })
  async handleUserEvents(
    message: GenericUserEvent,
    amqpMsg: ConsumeMessage,
  ): Promise<void> {
    const correlationId = amqpMsg.properties.headers['correlation-id'];
    const deliveryCount = getDeliveryCount(amqpMsg);

    if (!correlationId) {
      this.logger.warn(
        `Received message without correlation-id: ${JSON.stringify(message)}`,
        { context: EventConsumer.name },
      );
    }

    if (correlationId === '978b00a9-1435-4768-9ddf-b2c1a78c1206') {
      this.logger.debug('=========DELIVERY_COUNT========= ' + deliveryCount, {
        context: EventConsumer.name,
        correlationId,
      });
      throw new Error('Simulated failure for testing DLQ');
    }

    this.logger.log(
      `Received message: ${JSON.stringify(message)}, deliveryCount: ${deliveryCount}`,
      { context: EventConsumer.name, correlationId },
    );

    if (this.shouldFail()) {
      this.logger.error(
        `Failed to process message: ${JSON.stringify(message)}, headers: ${JSON.stringify(amqpMsg.properties.headers)}`,
        { context: EventConsumer.name, correlationId },
      );

      throw new Error('Random failure occurred during message processing');
    }

    this.logger.log(`Successfully processed message: ${message.messageId}`, {
      context: EventConsumer.name,
      correlationId,
    });
  }

  @RabbitSubscribe({
    exchange: EVENTS_EXCHANGE,
    routingKey: 'user.reprocess-dlq',
    queue: 'reprocess-dlq-queue',
    queueOptions: {
      durable: true,
      arguments: {
        'x-queue-type': 'quorum',
      },
    },
  })
  async handleReprocessDlq(
    _message: unknown,
    amqpMsg: ConsumeMessage,
  ): Promise<void> {
    const correlationId = amqpMsg.properties.headers['correlation-id'];

    this.logger.log(`Reprocessing DLQ message...`, {
      context: EventConsumer.name,
      correlationId,
    });

    await this.eventService.reprocessDlqMessages(correlationId);
  }

  private shouldFail(): boolean {
    return Math.random() < 0.5;
  }
}
