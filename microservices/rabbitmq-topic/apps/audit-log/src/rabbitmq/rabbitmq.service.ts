import {
  AUDIT_LOG_QUEUE,
  CREATED_ROUTING_KEY,
  DELETED_ROUTING_KEY,
  Event,
  rabbitmqValidationPipe,
  TOPIC_EXCHANGE,
  UPDATED_ROUTING_KEY,
} from '@app/common';
import {
  RabbitPayload,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, UsePipes } from '@nestjs/common';
import { LogRepository } from '../repository/log.repository';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(
    'AuditLog' + RabbitmqService.name,
  );

  constructor(private readonly logRepository: LogRepository) {}

  @UsePipes(rabbitmqValidationPipe)
  @RabbitSubscribe({
    exchange: TOPIC_EXCHANGE,
    queue: AUDIT_LOG_QUEUE,
    routingKey: [
      CREATED_ROUTING_KEY,
      UPDATED_ROUTING_KEY,
      DELETED_ROUTING_KEY,
    ],
  })
  async log(@RabbitPayload() payload: Event<any, any>) {
    const { timestamp, ...rest } = payload;

    await this.logRepository.create({
      ...rest,
      timestamp: new Date(timestamp),
    });
  }
}
