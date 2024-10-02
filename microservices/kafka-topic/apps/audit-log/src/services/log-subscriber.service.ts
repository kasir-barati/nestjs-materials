import {
  MESSAGE_CONSUMER,
  MessageConsumerService,
} from '@app/common';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { LogHandlerService } from './log-handler.service';

@Injectable()
export class LogSubscriberService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(MESSAGE_CONSUMER)
    private readonly messageConsumerService: MessageConsumerService,
    private readonly logHandlerService: LogHandlerService,
  ) {}

  async onModuleDestroy() {
    await this.messageConsumerService.disconnect();
  }

  async onModuleInit() {
    await this.messageConsumerService.addTopics(
      ['users'],
      this.logHandlerService,
    );
  }
}
