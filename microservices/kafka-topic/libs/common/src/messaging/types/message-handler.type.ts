export abstract class IMessageHandler<T> {
  abstract process(message: T): Promise<void>;
}
