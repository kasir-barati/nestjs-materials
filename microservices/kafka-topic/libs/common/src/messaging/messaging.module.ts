import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { kafkaConsumerFactory } from './factory-providers/kafka-consumer.factory-provider';
import { kafkaFactory } from './factory-providers/kafka-instance.factory-provider';
import { messageConsumerFactory } from './factory-providers/message-consumer.factory-provider';
import { messageProducerFactory } from './factory-providers/message-producer.factory-provider';
import messagingConfig from './messaging.config';
import {
  MESSAGE_CONSUMER,
  MESSAGE_PRODUCER,
  MESSAGING_MODULE_OPTIONS,
} from './messaging.constants';
import { MessagingModuleOptions } from './types/messaging.type';

@Module({
  imports: [ConfigModule.forFeature(messagingConfig)],
})
export class MessagingModule {
  static forRoot(options: MessagingModuleOptions): DynamicModule {
    return {
      module: MessagingModule,
      providers: [
        kafkaFactory,
        kafkaConsumerFactory,
        messageConsumerFactory,
        messageProducerFactory,
        {
          provide: MESSAGING_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [MESSAGE_PRODUCER, MESSAGE_CONSUMER],
    };
  }
}
