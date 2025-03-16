import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { IPushManager } from '../contracts/interfaces/push-manager.interface';

@Injectable()
export class PushManager<T> implements IPushManager<T>, OnModuleInit {
    private readonly publishRedisClient: RedisClientType;

    constructor(
        private readonly redisClient: RedisClientType,
        private readonly channel: string,
    ) {
        // need to duplicate the client because we cant subscribe and publish on the same client
        // fixes this error:
        // ERR only (P)SUBSCRIBE / (P)UNSUBSCRIBE / PING / QUIT allowed in this context
        this.publishRedisClient = redisClient.duplicate();
        this.publishRedisClient.on('error', (err) => {
            console.log('Redis error: ', err);
        });
    }

    async onModuleInit() {
        await this.publishRedisClient.connect();
    }

    async broadcastForReplicas(event: T): Promise<void> {
        await this.publishRedisClient.publish(
            this.channel,
            JSON.stringify(event),
        );
    }

    async disconnect(): Promise<void> {
        await this.redisClient.disconnect();
        await this.publishRedisClient.disconnect();
    }

    async onMessage(callback: (message: T) => void): Promise<void> {
        await this.redisClient.subscribe(
            this.channel,
            (message: string) => {
                callback(JSON.parse(message));
            },
        );
    }
}
