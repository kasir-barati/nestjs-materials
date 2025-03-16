import { ConfigService } from '@nestjs/config';
import { GeneralEnv } from 'env';
import { Kafka } from 'kafkajs';
import { MessagingEnv } from './messaging-env.config';

export function getKafka(
    configService: ConfigService<MessagingEnv & GeneralEnv>,
    application: string,
) {
    const ca = '';
    const broker =
        configService.get<string>('MESSAGING_BROKER') ??
        '127.0.0.1:9092';
    const username =
        configService.get<string>('MESSAGING_USERNAME') ?? 'admin';
    const password =
        configService.get<string>('MESSAGING_PASSWORD') ??
        'admin-123';
    const ssl = configService.get<string>('DEPLOYMENT')
        ? {
              ca,
          }
        : false;

    return new Kafka({
        clientId: `${application}-instance-${module}`,
        brokers: [broker],
        sasl: {
            username,
            password,
            mechanism: 'scram-sha-512',
        },
        ssl,
    });
}
