import { ConfigService } from '@nestjs/config';
import { GeneralEnv } from 'env';
import { Kafka } from 'kafkajs';
import { MessagingModuleOptions } from '../contracts/interfaces/messaging-module.interface';

export async function getKafkaConsumer({
    kafka,
    module,
    application,
    configService,
}: {
    configService: ConfigService<GeneralEnv>;
    kafka: Kafka;
} & MessagingModuleOptions) {
    const deployment =
        configService.get<string>('DEPLOYMENT') ?? null;
    const groupId = deployment
        ? `${application}-${module}-${deployment}`
        : `${application}-${module}`;
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();

    return consumer;
}
