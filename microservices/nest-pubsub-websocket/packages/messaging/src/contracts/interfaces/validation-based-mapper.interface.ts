import { IMessageProcessor } from './message-processor.interface';

export abstract class IValidationBasedMapper {
    abstract addMapping<T>(
        topic: string,
        type: new () => T,
        ...handlers: IMessageProcessor<T>[]
    ): void;
}
