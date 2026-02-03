import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN, SomeModuleOptions } from './some-module.definition';

@Injectable()
export class SomeService {
  private readonly logger = new Logger(SomeService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: SomeModuleOptions,
    private readonly amqpConnection: AmqpConnection,
  ) {
    this.logger.log(`SomeService initialized with: ${this.options.some}`);
  }

  async publishEvent(payload: any) {
    const routingKey = 'some.event';
    const exchange = 'amq.topic';
    
    this.logger.log(`Publishing event to ${exchange} with routing key: ${routingKey}`);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);
    
    await this.amqpConnection.publish(exchange, routingKey, payload);
    
    this.logger.log('Event published successfully');
  }

  getSomeValue(): string {
    return this.options.some;
  }
}
