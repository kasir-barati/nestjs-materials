import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { getClient } from './configs/get-client.config';
import { getPushManager } from './configs/get-push-manager.config';
import pushScalingEnvConfig from './configs/push-scaling-env.config';
import { IPushManager } from './contracts/interfaces/push-manager.interface';
import { PushModuleOptions } from './contracts/interfaces/push-module-options.interface';
import { PUSH_MODULE_REDIS } from './push.constant';

@Module({})
export class PushModule {
    static forRoot(options: PushModuleOptions): DynamicModule {
        const { channel } = options;

        return {
            module: PushModule,
            imports: [ConfigModule.forFeature(pushScalingEnvConfig)],
            providers: [
                {
                    provide: PUSH_MODULE_REDIS,
                    useFactory: getClient,
                    inject: [ConfigService],
                },
                {
                    provide: IPushManager,
                    useFactory: (redisClient: RedisClientType) =>
                        getPushManager(redisClient, channel),
                    inject: [PUSH_MODULE_REDIS],
                },
            ],
            exports: [IPushManager],
        };
    }
}
