import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

import { CustomLoggerService } from '../logger/custom-logger.service';

@Injectable()
export class EventConsumer {
  constructor(private readonly logger: CustomLoggerService) {}

  @RabbitSubscribe({
    exchange: 'events',
    routingKey: ['user.*'],
    queue: 'events-queue',
    queueOptions: {
      durable: true,
      arguments: {
        'x-queue-type': 'quorum',
      },
    },
  })
  async handleUserRegistered(
    message: {
      messageId: string;
      userInfo: {
        id: string;
        name: string;
      };
    },
    amqpMsg: ConsumeMessage,
  ): Promise<void> {
    const correlationId = amqpMsg.properties.headers['correlation-id'];
    const deliveryCount = amqpMsg.properties.headers?.['x-delivery-count'] ?? 0;

    if (!correlationId) {
      this.logger.warn(
        `Received message without correlation-id: ${JSON.stringify(message)}`,
        { context: EventConsumer.name },
      );
    }

    this.logger.log(
      `Received message: ${JSON.stringify(message)}, deliveryCount: ${deliveryCount}`,
      { context: EventConsumer.name, correlationId },
    );

    if (this.shouldFail()) {
      this.logger.error(`Failed to process message: ${message.messageId}`, {
        context: EventConsumer.name,
        correlationId,
      });
      throw new Error('Random failure occurred during message processing');
    }

    this.logger.log(`Successfully processed message: ${message.messageId}`, {
      context: EventConsumer.name,
      correlationId,
    });
  }

  private shouldFail(): boolean {
    return Math.random() < 0.5;
  }
}
