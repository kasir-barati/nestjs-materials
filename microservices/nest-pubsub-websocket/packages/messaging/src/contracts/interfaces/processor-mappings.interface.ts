import { IMessageProcessor } from './message-processor.interface';

export interface ProcessorMappings {
    [x: string]: IMessageProcessor<any>[];
}
