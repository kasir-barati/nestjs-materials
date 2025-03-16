import { Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { Logger } from 'logging';
import { IMessage } from '../contracts/interfaces/message.interface';
import { IMessagingProducer } from '../contracts/interfaces/messaging-producer.interface';

@Injectable()
export class MessagingProducer implements IMessagingProducer {
    constructor(private readonly producer: Producer) {}

    async produceToTopic(
        topic: string,
        messages: IMessage[],
    ): Promise<void> {
        await this.producer.send({
            topic,
            messages: messages.map((message) => ({
                key: message.partitionKey,
                value: message.data,
            })),
        });

        Logger.debug(
            `Produced messages: ${JSON.stringify(
                messages,
            )} to topic: ${topic}`,
        );
    }
}
