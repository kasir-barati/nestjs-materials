import { IMessage } from './message.interface';

export abstract class IMessagingProducer {
    abstract produceToTopic(
        topic: string,
        messages: IMessage[],
    ): Promise<void>;
}
