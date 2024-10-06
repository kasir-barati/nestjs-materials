import { FactoryProvider } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import {
  KAFKA_CLIENT,
  MESSAGE_PRODUCER,
} from '../messaging.constants';
import { MessageProducerService } from '../services/message-producer.service';

export const messageProducerFactory: FactoryProvider<MessageProducerService> =
  {
    provide: MESSAGE_PRODUCER,
    async useFactory(kafkaClient: Kafka) {
      const producer = kafkaClient.producer();

      await producer.connect();

      return new MessageProducerService(producer);
    },
    inject: [KAFKA_CLIENT],
  };
