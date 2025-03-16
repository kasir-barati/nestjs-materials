import { Injectable, Scope } from '@nestjs/common';
import * as retry from 'async-retry';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Consumer } from 'kafkajs';
import { Logger } from 'logging';
import { IConsumer } from '../contracts/interfaces/consumer.interface';
import { IMessageProcessor } from '../contracts/interfaces/message-processor.interface';
import { ProcessorMappings } from '../contracts/interfaces/processor-mappings.interface';
import { TypeMappings } from '../contracts/interfaces/type-mappings.interface';
import { IValidationBasedMapper } from '../contracts/interfaces/validation-based-mapper.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class ValidationBasedMessagingConsumer
    implements IConsumer, IValidationBasedMapper
{
    private readonly topicTypeMappings: TypeMappings = {};
    private readonly typeProcessorMappings: ProcessorMappings = {};

    constructor(private readonly consumer: Consumer) {}

    addMapping<T>(
        topic: string,
        type: new () => T,
        ...processors: IMessageProcessor<T>[]
    ): void {
        // Add new type for the topic
        const existingMappings = this.topicTypeMappings[topic] ?? [];
        this.topicTypeMappings[topic] = existingMappings.concat(
            type as ClassConstructor<any>,
        );

        // Add new processor for the type
        const existingProcessorMappings =
            (this.typeProcessorMappings[
                type.name
            ] as IMessageProcessor<any>[]) ?? [];
        this.typeProcessorMappings[type.name] =
            existingProcessorMappings.concat(processors);
    }

    getTopicTypeMappings(): TypeMappings {
        return this.topicTypeMappings;
    }

    getTypeProcessorMappings(): ProcessorMappings {
        return this.typeProcessorMappings;
    }

    async startConsuming(): Promise<void> {
        const topics: string[] = Object.keys(this.topicTypeMappings);

        await this.consumer.subscribe({ topics });
        await this.consumer.run({
            eachMessage: async ({ message, topic }) => {
                if (message.value == null) {
                    Logger.warn(
                        `Ignore message without content in topic: ${topic}`,
                    );
                    return;
                }

                Logger.debug(
                    `Received message in topic: ${topic}: ${message.value.toString()}`,
                );

                try {
                    // We loop through all type mappings of the topic
                    for (const Type of this.topicTypeMappings[
                        topic
                    ]) {
                        const Class = plainToInstance(
                            Type,
                            JSON.parse(message.value.toString()),
                        );
                        const errors = await validate(Class, {
                            forbidNonWhitelisted: true,
                        });

                        // We can skip the type if it does not match the expected type. The expected type would result in no errors.
                        if (errors.length) {
                            Logger.debug(
                                `Received message does not match type: ${Type.name}, skip processors ...`,
                            );
                            continue;
                        }

                        const handlers: IMessageProcessor<any>[] =
                            this.typeProcessorMappings[Type.name];
                        const retries = 10;

                        for (const handler of handlers) {
                            try {
                                // We retry each handler.
                                await retry(
                                    async () => {
                                        // TODO[jannik]: think about how we handle complex operations with migrations
                                        await handler.process(Class);
                                    },
                                    {
                                        retries,
                                        onRetry: (error, attempt) => {
                                            Logger.warn(
                                                `${attempt} attempt of retrying message in topic: ${topic} for message type: ${
                                                    Type.name
                                                }: ${message.value.toString()}`,
                                            );
                                        },
                                    },
                                );
                            } catch (e) {
                                // We do not throw here because we already retried the message multiple times.
                                Logger.error(e.stack);
                                Logger.warn(
                                    `Ignore message: ${message.value.toString()} in topic: ${topic} for message type: ${
                                        Type.name
                                    } after ${retries} attempts`,
                                );
                            }
                        }
                    }
                } catch (e) {
                    console.log(
                        `Received error in kafka message callback`,
                        e,
                    );
                    throw e;
                }
            },
        });
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect();
    }
}
