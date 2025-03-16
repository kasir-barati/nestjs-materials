import { IMessageProcessor } from './message-processor.interface';

export abstract class ICatchAllSkipFailingMapper {
    abstract addTopics(
        topics: string[],
        handler: IMessageProcessor<unknown>,
    ): Promise<void>;
}
