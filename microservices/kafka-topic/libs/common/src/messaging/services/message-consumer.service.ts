import { Injectable, Logger } from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { IMessageHandler } from '../types/message-handler.type';
import { MessagingModuleOptions } from '../types/messaging.type';

@Injectable()
export class MessageConsumerService {
  private readonly logger: Logger;

  constructor(
    private readonly consumer: Consumer,
    private readonly options: MessagingModuleOptions,
  ) {
    const context =
      MessageConsumerService.name +
      '-' +
      options.application +
      '-' +
      options.module;

    this.logger = new Logger(context);
  }

  async addTopics(
    topics: string[],
    handler: IMessageHandler<unknown>,
  ) {
    await this.consumer.subscribe({ topics });
    await this.consumer.run({
      async eachMessage({ message, topic }) {
        if (message.value == null) {
          this.logger.warn({
            reason: 'MessageWithoutContent',
            message: `Ignored message in this topic: ${topic}.`,
          });
          return;
        }

        this.logger.debug({
          description: `Received message in topic: ${topic}`,
          message: JSON.parse(message.value.toString()),
        });

        // If an error occurs message won't be marked as processed. Thus our NestJS app will retry it until we are able to process it.
        await handler.process(JSON.parse(message.value.toString()));
      },
    });
  }

  async disconnect(): Promise<void> {
    await this.consumer.disconnect();
  }
}
