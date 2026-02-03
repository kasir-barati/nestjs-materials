import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppConsumer {
  private readonly logger = new Logger(AppConsumer.name);

  @RabbitSubscribe({
    exchange: 'amq.topic',
    routingKey: 'some.event',
    queue: 'some-event-queue',
  })
  async handleSomeEvent(message: any) {
    this.logger.log('Received message from some.event:');
    this.logger.log(JSON.stringify(message, null, 2));
  }
}
