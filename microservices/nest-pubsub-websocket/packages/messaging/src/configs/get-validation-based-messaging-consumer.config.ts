import { Consumer } from 'kafkajs';
import { ValidationBasedMessagingConsumer } from '../consumers/validation-based-messaging-consumer';

export function getValidationBasedMessagingConsumer(
    consumer: Consumer,
) {
    return new ValidationBasedMessagingConsumer(consumer);
}
