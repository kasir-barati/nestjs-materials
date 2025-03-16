import { Producer } from 'kafkajs';
import * as sinon from 'sinon';
import { ISinonMock, SinonMock } from 'testing';
import { IMessage } from '../contracts/interfaces/message.interface';
import { MessagingProducer } from './messaging-producer';

describe('MessagingProducer', () => {
    let kafkaProducerMock: ISinonMock<Producer>;

    let producer: MessagingProducer;

    beforeEach(() => {
        kafkaProducerMock = SinonMock.with<Producer>({});

        producer = new MessagingProducer(kafkaProducerMock);
    });

    it.each(['topic', 'anotherTopic'])(
        'produceToTopic should produce to given topic',
        async (topic: string) => {
            await producer.produceToTopic(topic, []);

            expect(kafkaProducerMock.send).toHaveBeenCalledWith(
                sinon.match.has('topic', topic),
            );
        },
    );

    it.each(['message', 'anotherMessage'])(
        'produceToTopic should produce given message',
        async (messageValue: string) => {
            const message: IMessage = {
                partitionKey: 'id',
                data: messageValue,
            };

            await producer.produceToTopic('topic', [message]);

            expect(kafkaProducerMock.send).toHaveBeenCalledWith(
                sinon.match.has('messages', [
                    { key: 'id', value: messageValue },
                ]),
            );
        },
    );

    it.each([2, 5])(
        'produceToTopic should produce multiple messages',
        async (countOfMessages: number) => {
            const messages: IMessage[] = new Array(countOfMessages)
                .fill(countOfMessages)
                .map((_, i) => ({
                    partitionKey: i.toString(),
                    data: i.toString(),
                }));

            await producer.produceToTopic('topic', messages);

            expect(
                kafkaProducerMock.send.firstCall.firstArg.messages,
            ).toHaveLength(countOfMessages);
        },
    );
});
