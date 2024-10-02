import { Injectable, Logger } from '@nestjs/common';
import { Producer } from 'kafkajs';

@Injectable()
export class MessageProducerService {
  private readonly logger: Logger = new Logger(
    MessageProducerService.name,
  );

  constructor(private readonly producer: Producer) {}

  async produceTo(topic: string, message: string): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
    this.logger.debug({
      topic,
      message,
    });
  }
}
