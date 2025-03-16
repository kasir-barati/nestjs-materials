export abstract class IPushManager<T> {
    abstract broadcastForReplicas(event: T): Promise<void>;

    abstract onMessage(callback: (message: T) => void): Promise<void>;

    abstract disconnect(): Promise<void>;
}
