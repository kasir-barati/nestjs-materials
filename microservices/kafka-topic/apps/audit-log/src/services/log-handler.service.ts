import { IMessageHandler, KafkaEvent } from '@app/common';
import { Injectable } from '@nestjs/common';
import { LogRepository } from '../audit-log.repository';

@Injectable()
export class LogHandlerService
  implements IMessageHandler<KafkaEvent<unknown, unknown>>
{
  constructor(private readonly logRepository: LogRepository) {}

  async process(
    message: KafkaEvent<unknown, unknown>,
  ): Promise<void> {
    const { beforeEvent, afterEvent, timestamp, ...rest } = message;
    await this.logRepository.create({
      ...rest,
      timestamp: new Date(timestamp),
      afterEvent: afterEvent as any,
      beforeEvent: beforeEvent as any,
    });
  }
}
