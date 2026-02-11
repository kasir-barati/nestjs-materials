import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

import { GenericUserEvent } from '../../shared';
import { getDeliveryCount } from '../../utils';
import { CustomLoggerService } from '../logger';

@Injectable()
export class EventConsumer {
  constructor(private readonly logger: CustomLoggerService) {}

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: ['user.*'],
    queue: 'events-queue',
    errorHandler: (channel, message, _error) => {
      const deliveryCount = getDeliveryCount(message);
      const maxRetryCount = Number(process.env.RABBITMQ_MAX_RETRY_COUNT) ?? 3;

      // eslint-disable-next-line no-console
      console.log('=========DELIVERY_COUNT=========', deliveryCount);

      if (deliveryCount < maxRetryCount) {
        // Requeue the message with incremented x-delivery-count
        const { exchange, routingKey } = message.fields;
        const headers = {
          ...message.properties.headers,
          'x-delivery-count': deliveryCount + 1,
        };

        // Requeue the message!
        channel.publish(exchange, routingKey, message.content, {
          ...message.properties,
          headers,
        });

        // Acknowledge the original message to prevent redelivery
        channel.ack(message);
        return;
      }

      // Reject the message without requeue to send it to DLQ
      channel.nack(message, false, false);
    },
    queueOptions: {
      durable: true,
      arguments: {
        'x-queue-type': 'quorum',
        'x-dead-letter-exchange': 'events.dlx',
        'x-dead-letter-routing-key': 'user.dead-letter',
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

  // DLQ consumer removed - messages will pile up in the queue
  // Use the EventService.reprocessDLQMessages() method via API to manually process DLQ messages

  private shouldFail(): boolean {
    return Math.random() < 0.5;
  }
}
