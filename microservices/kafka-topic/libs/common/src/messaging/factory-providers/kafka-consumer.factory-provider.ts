import { FactoryProvider } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import {
  KAFKA_CLIENT,
  KAFKA_CONSUMER,
  MESSAGING_MODULE_OPTIONS,
} from '../messaging.constants';
import { MessagingModuleOptions } from '../types/messaging.type';

export const kafkaConsumerFactory: FactoryProvider<Consumer> = {
  provide: KAFKA_CONSUMER,
  async useFactory(
    { application, module }: MessagingModuleOptions,
    kafkaClient: Kafka,
  ) {
    const groupId = `${application}-${module}`;
    const consumer = kafkaClient.consumer({ groupId });

    await consumer.connect();

    return consumer;
  },
  inject: [
    { token: MESSAGING_MODULE_OPTIONS, optional: false },
    { token: KAFKA_CLIENT, optional: false },
  ],
};
