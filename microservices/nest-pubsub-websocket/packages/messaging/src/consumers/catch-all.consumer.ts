import { Injectable, Scope } from '@nestjs/common';
import { Consumer } from 'kafkajs';
import { Logger } from 'logging';
import { ICatchAllSkipFailingMapper } from '../contracts/interfaces/catch-all-skip-failing-mapper.interface';
import { IConsumer } from '../contracts/interfaces/consumer.interface';
import { IMessageProcessor } from '../contracts/interfaces/message-processor.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class CatchAllConsumer
    implements IConsumer, ICatchAllSkipFailingMapper
{
    constructor(private readonly consumer: Consumer) {}

    async addTopics(
        topics: string[],
        handler: IMessageProcessor<unknown>,
    ): Promise<void> {
        await this.consumer.subscribe({ topics });
        await this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                if (message.value == null) {
                    Logger.warn(
                        `Ignore message without content in topic: ${topic}`,
                    );
                    return;
                }

                Logger.debug(
                    `Received message in topic: ${topic}: ${message.value.toString()}`,
                );

                try {
                    await handler.process(
                        JSON.parse(message.value.toString()),
                    );
                } catch (e) {
                    Logger.error(
                        `Error while processing message: ${message.value.toString()}`,
                        e,
                    );
                    // We rethrow the error to make sure the message is not marked as processed. We will retry it until we are able to handle it.
                    throw e;
                }
            },
        });
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }

    startConsuming(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
