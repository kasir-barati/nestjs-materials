import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SecondService {
  private readonly logger = new Logger(SecondService.name);

  @OnEvent('some-event')
  async getHello(name: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(`SecondService`);

    return `Hello ${name}!`;
  }
}
