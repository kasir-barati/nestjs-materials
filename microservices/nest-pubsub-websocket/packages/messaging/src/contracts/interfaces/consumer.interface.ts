export abstract class IConsumer {
    abstract startConsuming(): Promise<void>;

    abstract disconnect(): Promise<void>;
}
