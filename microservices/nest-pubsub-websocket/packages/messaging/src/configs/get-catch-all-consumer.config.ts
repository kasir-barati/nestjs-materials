import { Consumer } from 'kafkajs';
import { CatchAllConsumer } from '../consumers/catch-all.consumer';

export function getCatchAllConsumer(consumer: Consumer) {
    return new CatchAllConsumer(consumer);
}
