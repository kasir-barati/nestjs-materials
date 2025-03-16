export abstract class IMessageProcessor<T> {
    abstract process(message: T): Promise<void>;
}
