import { RedisClientType } from 'redis';
import { PushManager } from '../providers/push-manager';

export function getPushManager(
    redisClient: RedisClientType,
    channel: string,
) {
    return new PushManager(redisClient, channel);
}
