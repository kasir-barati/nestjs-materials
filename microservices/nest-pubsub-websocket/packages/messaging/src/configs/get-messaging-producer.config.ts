import { Kafka } from 'kafkajs';
import { MessagingProducer } from '../producers/messaging-producer';

export async function getMessagingProducer(kafkaClient: Kafka) {
    const producer = kafkaClient.producer();
    await producer.connect();

    return new MessagingProducer(producer);
}
