import { IsNotEmpty, IsString } from 'class-validator';
import { Consumer, KafkaMessage } from 'kafkajs';
import { ISinonMock, SinonMock } from 'testing';
import { IMessageProcessor } from '../contracts/interfaces/message-processor.interface';
import { ValidationBasedMessagingConsumer } from './validation-based-messaging-consumer';

describe('ValidationBasedMessagingConsumer', () => {
    let kafkaConsumerMock: ISinonMock<Consumer>;
    let testProcessor: ISinonMock<TestProcessor>;
    let consumer: ValidationBasedMessagingConsumer;

    beforeEach(() => {
        kafkaConsumerMock = SinonMock.with<Consumer>({});
        testProcessor = SinonMock.with<TestProcessor>({});
        consumer = new ValidationBasedMessagingConsumer(
            kafkaConsumerMock,
        );
    });

    it('disconnect should disconnect consumer', async () => {
        await consumer.disconnect();

        expect(kafkaConsumerMock.disconnect).toHaveBeenCalled();
    });

    it.each(['topic', 'anotherTopic'])(
        'addMapping should register given type for given topic',
        (topic: string) => {
            consumer.addMapping(topic, TestType, new TestProcessor());

            const mappings = consumer.getTopicTypeMappings();

            expect(mappings).toStrictEqual({
                [topic]: [TestType],
            });
        },
    );

    it('addMapping should register given processor for given type', () => {
        const processor = new TestProcessor();

        consumer.addMapping<TestType>('topic', TestType, processor);
        const mappings = consumer.getTypeProcessorMappings();

        expect(mappings).toStrictEqual({
            [TestType.name]: [processor],
        });
    });

    it.each(['topic', 'anotherTopic'])(
        'startConsuming should subscribe to registered topic',
        async (topic: string) => {
            consumer.addMapping(topic, TestType, testProcessor);

            await consumer.startConsuming();

            expect(kafkaConsumerMock.subscribe).toHaveBeenCalledWith({
                topics: [topic],
            });
        },
    );

    it.each([[['topic', 'anotherTopic']], [['topic-a']]])(
        'startConsuming should subscribe to multiple registered topics',
        async (topics: string[]) => {
            for (const topic of topics) {
                consumer.addMapping<TestType>(
                    topic,
                    TestType,
                    testProcessor,
                );
            }

            await consumer.startConsuming();

            expect(kafkaConsumerMock.subscribe).toHaveBeenCalledWith({
                topics,
            });
        },
    );

    it('startConsuming should call registered processor', async () => {
        const topic = 'topic';
        consumer.addMapping(topic, TestType, testProcessor);
        const message = { key: 'value' };
        const kafkaMessage: ISinonMock<KafkaMessage> =
            SinonMock.with<KafkaMessage>({
                value: Buffer.from(JSON.stringify(message), 'utf8'),
            });
        kafkaConsumerMock.run.yieldsTo('eachMessage', {
            topic,
            message: kafkaMessage,
        });

        await consumer.startConsuming();

        expect(
            testProcessor.process.firstCall.firstArg,
        ).toBeInstanceOf(TestType);
    });

    it.each([2, 5])(
        'startConsuming should call multiple registered processors for given type',
        async (countOfProcessors: number) => {
            const topic = 'topic';
            consumer.addMapping(
                topic,
                TestType,
                ...new Array(countOfProcessors)
                    .fill(null)
                    .map(() => testProcessor),
            );
            const message = { key: 'value' };
            const kafkaMessage: ISinonMock<KafkaMessage> =
                SinonMock.with<KafkaMessage>({
                    value: Buffer.from(
                        JSON.stringify(message),
                        'utf8',
                    ),
                });
            kafkaConsumerMock.run.yieldsTo('eachMessage', {
                topic,
                message: kafkaMessage,
            });

            await consumer.startConsuming();

            expect(testProcessor.process).toHaveBeenCalledTimes(
                countOfProcessors,
            );
        },
    );

    it('startConsuming should not call processor if payload of received message is null', async () => {
        const kafkaMessage: ISinonMock<KafkaMessage> =
            SinonMock.with<KafkaMessage>({ value: null });
        kafkaConsumerMock.run.yieldsTo('eachMessage', {
            message: kafkaMessage,
        });

        await consumer.startConsuming();

        expect(testProcessor.process).not.toHaveBeenCalled();
    });

    it('startConsuming should ignore malformed message for given topic type mapping', async () => {
        const topic = 'topic';
        consumer.addMapping(topic, TestType, testProcessor);
        const message = { key: 1 };
        const kafkaMessage: ISinonMock<KafkaMessage> =
            SinonMock.with<KafkaMessage>({
                value: Buffer.from(JSON.stringify(message), 'utf8'),
            });
        kafkaConsumerMock.run.yieldsTo('eachMessage', {
            topic,
            message: kafkaMessage,
        });

        const delegate = consumer.startConsuming();

        await expect(delegate).resolves.not.toThrow();
        expect(testProcessor.process).not.toHaveBeenCalled();
    });
});

class TestType {
    @IsNotEmpty()
    @IsString()
    key: string;
}

class TestProcessor implements IMessageProcessor<TestType> {
    process(message: TestType): Promise<void> {
        return;
    }
}
