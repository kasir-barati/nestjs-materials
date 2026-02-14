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
  async reprocessDlqMessagesOfEvents(correlationId: string): Promise<void> {
    let failedToProcessCounter = 0;

    try {
      const channel = this.amqpConnection.channel;
      const queueInfo = await channel.checkQueue(this.EVENTS_DEAD_LETTER_QUEUE);
      const messageCount = queueInfo.messageCount;

      this.logger.log(
        `Starting DLQ reprocessing. Messages in queue: ${messageCount}`,
        { context: EventService.name, correlationId },
      );

      if (messageCount === 0) {
        return;
      }

      for (let i = 0; i < messageCount; i++) {
        const msg = await channel.get(this.EVENTS_DEAD_LETTER_QUEUE, {
          noAck: false, // NO auto acknowledging the message!
        });

        if (!msg) {
          break;
        }

        try {
          await this.republishToSourceQueue(msg, correlationId);
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg, false, true); // Keep the message in the DLQ.
          failedToProcessCounter++;

          this.logger.error(`Failed to republish message: ${error.message}`, {
            context: EventService.name,
            correlationId,
          });
        }
      }

      this.logger.log(
        `DLQ republished messages. It failed to republish ${failedToProcessCounter} out of ${messageCount} messages.`,
        { context: EventService.name, correlationId },
      );
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
  private async republishToSourceQueue(
    amqpMsg: Message,
    correlationId: string,
  ): Promise<void> {
    const message: GenericUserEvent = JSON.parse(amqpMsg.content.toString());
    /**
     * `amqpMsg.properties.headers` example:
       {
         "correlation-id": "978b00a9-1435-4768-9ddf-b2c1a78c1206",
         "x-death": [
             {
                 "count": 1,
                 "reason": "delivery_limit",
                 "queue": "events-queue",
                 "time": { "!": "timestamp", "value": 1770892018 },
                 "exchange": "events",
                 "routing-keys": ["user.registered"]
             }
         ],
         "x-delivery-count":0,
         "x-first-death-exchange": "events",
         "x-first-death-queue": "events-queue",
         "x-first-death-reason": "delivery_limit",
         "x-last-death-exchange": "events",
         "x-last-death-queue": "events-queue",
         "x-last-death-reason": "delivery_limit"
       }
     */

    const originalExchange =
      amqpMsg.properties.headers['x-first-death-exchange'];
    const originalRoutingKey: string[] =
      amqpMsg.properties.headers['x-death'][0]['routing-keys'];

    this.logger.log(
      `Republishing message to exchange: ${originalExchange}, routingKeys: ${JSON.stringify(originalRoutingKey)}`,
      { context: EventService.name, correlationId },
    );

    const headers = {
      ...amqpMsg.properties.headers,
      'x-delivery-count': 0,
      'correlation-id': correlationId,
    };

    for (const routingKey of originalRoutingKey) {
      await this.amqpConnection.publish(originalExchange, routingKey, message, {
        headers,
        persistent: true,
      });
    }

    this.logger.log(
      `Message republished successfully: ${JSON.stringify(message)}`,
      { context: EventService.name, correlationId },
    );
  }
}
