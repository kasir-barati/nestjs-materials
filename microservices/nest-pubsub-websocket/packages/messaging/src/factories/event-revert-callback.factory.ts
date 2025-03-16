import { IMessagingProducer } from '../contracts/interfaces/messaging-producer.interface';

export class EventRevertEvent {
    // EventId to revert
    eventId: string;
}

/**
 * Factory to create a callback function that produces an EventRevertEvent for the given topic.
 *
 * @param {IMessagingProducer} messageProducer - Our kafka producer
 * @param {string} topic - Name of the topic to publish to
 * @param {string} partitionKey - Partition key to use for the event
 * @param {string} eventId - EventId to revert
 * @constructor
 */
export const EventRevertCallbackFactory = (
    messageProducer: IMessagingProducer,
    topic: string,
    partitionKey: string,
    eventId: string,
) => {
    return async () => {
        const event = new EventRevertEvent();
        event.eventId = eventId;
        await messageProducer.produceToTopic(topic, [
            { partitionKey, data: JSON.stringify(event) },
        ]);
    };
};
