import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Message } from 'amqplib';

import {
  EXCHANGE_OF_DLQ_FOR_EVENTS_QUEUE,
  GenericUserEvent,
  ROUTING_KEY_OF_DLQ_FOR_EVENTS_QUEUE,
} from '../../shared';
import { CustomLoggerService } from '../logger';

@Injectable()
export class EventService implements OnModuleInit {
  private readonly EVENTS_DEAD_LETTER_QUEUE = 'events-dlq';

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly logger: CustomLoggerService,
  ) {}

  async onModuleInit() {
    try {
      const channel = this.amqpConnection.channel;
      await channel.assertQueue(this.EVENTS_DEAD_LETTER_QUEUE, {
        durable: true,
        arguments: { 'x-queue-type': 'quorum' },
      });
      await channel.bindQueue(
        this.EVENTS_DEAD_LETTER_QUEUE,
        EXCHANGE_OF_DLQ_FOR_EVENTS_QUEUE,
        ROUTING_KEY_OF_DLQ_FOR_EVENTS_QUEUE,
      );
      this.logger.log(
        `Successfully declared queues: ${this.EVENTS_DEAD_LETTER_QUEUE}`,
        { context: EventService.name },
      );
    } catch (error) {
      this.logger.error(`Failed to declare queues: ${error.message}`, {
        context: EventService.name,
      });
      throw error;
    }
  }
  /**
   * @description Consumes all messages from the DLQ and republish them back to the source queue for reprocessing.
   */
  async reprocessDlqMessages(correlationId: string): Promise<{
    processed: number;
    errors: number;
  }> {
    let processed = 0;
    let errors = 0;

    try {
      const channel = this.amqpConnection.channel;

      // Check queue stats
      const queueInfo = await channel.checkQueue(this.EVENTS_DEAD_LETTER_QUEUE);
      const messageCount = queueInfo.messageCount;

      this.logger.log(
        `Starting DLQ reprocessing. Messages in queue: ${messageCount}`,
        { context: EventService.name, correlationId },
      );

      if (messageCount === 0) {
        return { processed: 0, errors: 0 };
      }

      // Process messages one by one
      for (let i = 0; i < messageCount; i++) {
        const msg = await channel.get(this.EVENTS_DEAD_LETTER_QUEUE, {
          noAck: false,
        });

        if (!msg) {
          // No more messages
          break;
        }

        try {
          await this.republishToSourceQueue(msg);
          channel.ack(msg);
          processed++;

          this.logger.log(
            `Successfully republished message ${i + 1}/${messageCount}`,
            { context: EventService.name },
          );
        } catch (error) {
          errors++;
          // Nack the message to keep it in DLQ if republishing fails
          channel.nack(msg, false, true);

          this.logger.error(`Failed to republish message: ${error.message}`, {
            context: EventService.name,
            correlationId,
          });
        }
      }

      this.logger.log(
        `DLQ reprocessing completed. Processed: ${processed}, Errors: ${errors}`,
        { context: EventService.name, correlationId },
      );

      return { processed, errors };
    } catch (error) {
      this.logger.error(`DLQ reprocessing failed: ${error.message}`, {
        context: EventService.name,
        correlationId,
      });
      throw error;
    }
  }

  /**
   * Republish a message from DLQ back to the source queue
   */
  private async republishToSourceQueue(amqpMsg: Message): Promise<void> {
    const message: GenericUserEvent = JSON.parse(amqpMsg.content.toString());
    const correlationId = amqpMsg.properties.headers['correlation-id'];

    // Get original exchange and routing key from dead letter headers
    const originalExchange =
      amqpMsg.properties.headers['x-first-death-exchange'] || 'events';
    const originalRoutingKey =
      amqpMsg.properties.headers['x-first-death-routing-key'] ||
      'user.registered';

    this.logger.log(
      `Republishing message to exchange: ${originalExchange}, routingKey: ${originalRoutingKey}`,
      { context: EventService.name, correlationId },
    );

    // Reset delivery count for fresh retry attempts
    const headers = {
      ...amqpMsg.properties.headers,
      'x-delivery-count': 0,
      'correlation-id': correlationId,
    };

    // Remove dead letter specific headers
    delete headers['x-death'];
    delete headers['x-first-death-exchange'];
    delete headers['x-first-death-queue'];
    delete headers['x-first-death-reason'];
    delete headers['x-first-death-routing-key'];

    // Republish to the original queue via the original exchange
    await this.amqpConnection.publish(
      originalExchange,
      originalRoutingKey,
      message,
      {
        headers,
        persistent: true,
      },
    );

    this.logger.log(
      `Message republished successfully: ${JSON.stringify(message)}`,
      { context: EventService.name, correlationId },
    );
  }
}
