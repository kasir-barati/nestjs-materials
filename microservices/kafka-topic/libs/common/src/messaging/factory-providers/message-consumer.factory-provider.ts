import { FactoryProvider } from '@nestjs/common';
import { Consumer } from 'kafkajs';
import {
  KAFKA_CONSUMER,
  MESSAGE_CONSUMER,
  MESSAGING_MODULE_OPTIONS,
} from '../messaging.constants';
import { MessageConsumerService } from '../services/message-consumer.service';
import { MessagingModuleOptions } from '../types/messaging.type';

export const messageConsumerFactory: FactoryProvider<MessageConsumerService> =
  {
    provide: MESSAGE_CONSUMER,
    useFactory(consumer: Consumer, options: MessagingModuleOptions) {
      return new MessageConsumerService(consumer, options);
    },
    inject: [
      { token: KAFKA_CONSUMER, optional: false },
      { token: MESSAGING_MODULE_OPTIONS, optional: false },
    ],
  };
