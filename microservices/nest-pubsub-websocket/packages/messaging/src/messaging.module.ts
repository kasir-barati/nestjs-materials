import { DynamicModule, Module, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { GeneralEnv } from 'env';
import { Kafka } from 'kafkajs';
import { getCatchAllConsumer } from './configs/get-catch-all-consumer.config';
import { getKafkaConsumer } from './configs/get-kafka-consumer.config';
import { getKafka } from './configs/get-kafka.config';
import { getMessagingProducer } from './configs/get-messaging-producer.config';
import { getTopicResolver } from './configs/get-topic-resolver.config';
import { getValidationBasedMessagingConsumer } from './configs/get-validation-based-messaging-consumer.config';
import messagingEnvConfig, {
    MessagingEnv,
} from './configs/messaging-env.config';
import { CatchAllConsumer } from './consumers/catch-all.consumer';
import { ValidationBasedMessagingConsumer } from './consumers/validation-based-messaging-consumer';
import { IEventSkeletonMapper } from './contracts/interfaces/event-skeleton-mapper.interface';
import { MessagingModuleOptions } from './contracts/interfaces/messaging-module.interface';
import { IMessagingProducer } from './contracts/interfaces/messaging-producer.interface';
import { ITopicResolver } from './contracts/interfaces/topic-resolver.interface';
import { EventSkeletonMapper } from './mappers/event-skeleton.mapper';
import {
    KafkaConsumer,
    MESSAGING_MODULE_ID,
} from './messaging.constant';

@Module({})
export class MessagingModule {
    static register(options: MessagingModuleOptions): DynamicModule {
        const { application, module } = options;

        return {
            module: MessagingModule,
            imports: [ConfigModule.forFeature(messagingEnvConfig)],
            providers: [
                {
                    provide: Kafka,
                    useFactory: (
                        configService: ConfigService<
                            MessagingEnv & GeneralEnv
                        >,
                    ) => getKafka(configService, application),
                    inject: [ConfigService],
                    scope: Scope.TRANSIENT,
                },
                {
                    provide: MESSAGING_MODULE_ID,
                    useValue: randomUUID(),
                },
                {
                    provide: KafkaConsumer,
                    useFactory: async (
                        configService: ConfigService<GeneralEnv>,
                        kafka: Kafka,
                    ) =>
                        await getKafkaConsumer({
                            application,
                            configService,
                            kafka,
                            module,
                        }),
                    inject: [ConfigService, Kafka],
                    scope: Scope.TRANSIENT,
                },
                {
                    provide: ValidationBasedMessagingConsumer,
                    useFactory: getValidationBasedMessagingConsumer,
                    inject: [KafkaConsumer],
                },
                {
                    provide: CatchAllConsumer,
                    useFactory: getCatchAllConsumer,
                    inject: [KafkaConsumer],
                },
                {
                    provide: IMessagingProducer,
                    useFactory: getMessagingProducer,
                    inject: [Kafka],
                },
                {
                    provide: ITopicResolver,
                    useFactory: getTopicResolver,
                    inject: [ConfigService],
                },
                {
                    provide: IEventSkeletonMapper,
                    useClass: EventSkeletonMapper,
                },
            ],
            exports: [
                ValidationBasedMessagingConsumer,
                CatchAllConsumer,
                IMessagingProducer,
                ITopicResolver,
                IEventSkeletonMapper,
            ],
        };
    }
}
