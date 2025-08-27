import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isEmpty, isNotEmpty } from 'class-validator';

@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) {}

  async getHelloKasir(): Promise<string> {
    const responses = await this.eventEmitter.emitAsync('some-event', 'Kasir');
    const result = responses.find((response) => isNotEmpty(response)) as string;

    if (isEmpty(result)) {
      throw new Error('Missing message');
    }

    return result;
  }
}
