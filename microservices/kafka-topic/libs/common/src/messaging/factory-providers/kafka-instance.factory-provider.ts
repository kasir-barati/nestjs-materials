import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';
import {
  KAFKA_INSTANCE,
  MESSAGING_MODULE_OPTIONS,
} from '../messaging.constants';
import { MessagingModuleOptions } from '../types/messaging.type';

export const kafkaFactory: FactoryProvider<Kafka> = {
  provide: KAFKA_INSTANCE,
  useFactory(
    options: MessagingModuleOptions,
    configService: ConfigService,
  ) {
    const broker = configService.getOrThrow(
      'messagingConfigs.MESSAGING_BROKER',
    );
    const username = configService.getOrThrow(
      'messagingConfigs.MESSAGING_USERNAME',
    );
    const password = configService.getOrThrow(
      'messagingConfigs.MESSAGING_PASSWORD',
    );

    return new Kafka({
      clientId: `${options.application}-instance-${options.module}`,
      brokers: [broker],
      sasl: {
        username,
        password,
        mechanism: 'scram-sha-512',
      },
      ssl: false,
    });
  },
  inject: [
    { token: MESSAGING_MODULE_OPTIONS, optional: false },
    ConfigService,
  ],
};
