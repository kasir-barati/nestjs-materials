import { Consumer, KafkaMessage } from 'kafkajs';
import { ISinonMock, SinonMock } from 'testing';
import { IMessageProcessor } from '../contracts/interfaces/message-processor.interface';
import { CatchAllConsumer } from './catch-all.consumer';

describe('CatchAllConsumer', () => {
    let consumer: ISinonMock<Consumer>;
    let catchAllConsumer: CatchAllConsumer;

    beforeEach(() => {
        consumer = SinonMock.with<Consumer>({});
        catchAllConsumer = new CatchAllConsumer(consumer);
    });

    it('addTopics should subscribe to given topics', async () => {
        const topics = ['Topic A', 'Topic B'];

        await catchAllConsumer.addTopics(topics, new TestProcessor());

        expect(consumer.subscribe).toHaveBeenCalledWith({ topics });
    });

    it('addTopics should run provided handler for received message', async () => {
        const topic = 'Topic A';
        const testProcessor = SinonMock.of(TestProcessor);
        const message = { value: 'Test Message' };
        const kafkaMessage: ISinonMock<KafkaMessage> =
            SinonMock.with<KafkaMessage>({
                value: Buffer.from(JSON.stringify(message), 'utf8'),
            });
        consumer.run.yieldsTo('eachMessage', {
            topic,
            message: kafkaMessage,
        });

        await catchAllConsumer.addTopics([topic], testProcessor);

        expect(consumer.run).toHaveBeenCalled();
        expect(testProcessor.process).toHaveBeenCalledWith(message);
    });

    it('addTopics should not call handler if payload of received message is null', async () => {
        const testProcessor = SinonMock.of(TestProcessor);
        const kafkaMessage: ISinonMock<KafkaMessage> =
            SinonMock.with<KafkaMessage>({ value: null });
        consumer.run.yieldsTo('eachMessage', {
            message: kafkaMessage,
        });

        await catchAllConsumer.addTopics(['Topic A'], testProcessor);

        expect(testProcessor.process).not.toHaveBeenCalled();
    });

    it('disconnect should disconnect consumer', async () => {
        await catchAllConsumer.disconnect();

        expect(consumer.disconnect).toHaveBeenCalled();
    });
});

class TestProcessor implements IMessageProcessor<unknown> {
    async process(message: unknown): Promise<void> {}
}
