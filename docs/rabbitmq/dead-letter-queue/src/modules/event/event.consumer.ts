import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConsumeMessage } from 'amqplib';

@Injectable()
export class EventConsumer {
  private readonly logger = new Logger(EventConsumer.name);

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
      );
    }

    this.logger.log(
      `Received message: ${JSON.stringify(message)}, deliveryCount: ${deliveryCount}`,
      { correlationId },
    );

    if (this.shouldFail()) {
      this.logger.error(`Failed to process message: ${message.messageId}`, {
        correlationId,
      });
      throw new Error('Random failure occurred during message processing');
    }

    this.logger.log(`Successfully processed message: ${message.messageId}`, {
      correlationId,
    });
  }

  private shouldFail(): boolean {
    return Math.random() < 0.5;
  }
}
