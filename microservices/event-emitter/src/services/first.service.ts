import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FirstService {
  private readonly logger = new Logger(FirstService.name);

  @OnEvent('some-event')
  async getHello(name: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log(`FirstService`);

    // return `Hello ${name}!`;
  }
}
