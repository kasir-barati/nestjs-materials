import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { GeneralEnv } from 'backend/libs/env/general-envs';
import { PushScalingEnv } from './push-scaling-env.config';

export async function getClient(
    configService: ConfigService<GeneralEnv & PushScalingEnv>,
): Promise<ReturnType<typeof createClient>> {
    const host =
        configService.get<string>('REDIS_HOST') ?? 'localhost';
    const port = configService.get<number>('REDIS_PORT') ?? 6379;
    const deployment =
        configService.get<string>('DEPLOYMENT') ?? null;
    const username =
        configService.get<string>('REDIS_USERNAME') ?? null;
    const password =
        configService.get<string>('REDIS_PASSWORD') ?? null;
    const url = deployment
        ? `rediss://${username}:${password}@${host}:${port}`
        : `redis://${host}:${port}`;
    const client = createClient({
        url,
    });

    client.on('error', (err) => console.log('Redis error: ', err));

    client.on('connect', () => console.log('Redis is connecting'));

    client.on('ready', () => console.log('Redis client connected'));

    client.on('end', () => console.log('Redis client disconnected'));

    client.on('reconnecting', () =>
        console.log('Redis client is reconnecting'),
    );

    try {
        console.log(
            'pre connect: if this is one of the last logs, then the redis client is probably stuck in a reconnecting loop',
        );
        await client.connect();
        console.log('post connect -> not a reconnecting loop');
    } catch (err) {
        console.error('Redis connection error: ', err);
    }

    return client;
}
