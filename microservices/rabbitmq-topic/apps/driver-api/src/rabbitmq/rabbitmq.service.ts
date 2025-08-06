import {
  DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
  DRIVER_VERIFICATION_RES_QUEUE,
  Event,
  RabbitmqErrorLogger,
  rabbitmqValidationPipe,
  TOPIC_EXCHANGE,
  VERIFICATION_CREATED_ROUTING_KEY,
  VERIFICATION_DELETED_ROUTING_KEY,
} from '@app/common';
import {
  AmqpConnection,
  RabbitPayload,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, UsePipes } from '@nestjs/common';
import { DriverRepository } from '../driver/repository/driver.repository';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(
    'Driver' + RabbitmqService.name,
  );

  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @UsePipes(rabbitmqValidationPipe)
  @RabbitSubscribe({
    exchange: TOPIC_EXCHANGE,
    queue: DRIVER_VERIFICATION_RES_QUEUE,
    routingKey: VERIFICATION_CREATED_ROUTING_KEY,
  })
  async driverVerificationReqResponse(
    @RabbitPayload() payload: Event<undefined, any>,
  ) {
    try {
      await this.driverRepository.update(
        payload.afterEvent.driverId,
        {
          verificationId: payload.afterEvent._id,
        },
      );
    } catch (error) {
      const { retryCount = 0, ...rest } = payload;

      if (retryCount < 4) {
        await this.amqpConnection.publish(
          TOPIC_EXCHANGE,
          VERIFICATION_CREATED_ROUTING_KEY,
          {
            ...rest,
            retryCount: retryCount + 1,
          },
        );
      } else {
        this.logger.error({
          message: 'Could not process verification request response',
          payload,
          exchange: TOPIC_EXCHANGE,
          queue: DRIVER_VERIFICATION_RES_QUEUE,
          routingKey: VERIFICATION_CREATED_ROUTING_KEY,
        } as RabbitmqErrorLogger);
      }

      throw error;
    }
  }

  @UsePipes(rabbitmqValidationPipe)
  @RabbitSubscribe({
    exchange: TOPIC_EXCHANGE,
    queue: DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
    routingKey: VERIFICATION_DELETED_ROUTING_KEY,
  })
  async driverVerificationReqCompensate(
    @RabbitPayload() payload: Event<any, undefined>,
  ) {
    try {
      await this.driverRepository.delete(
        payload.beforeEvent.driverId,
      );
    } catch (error) {
      const { retryCount = 0, ...rest } = payload;

      if (retryCount < 4) {
        await this.amqpConnection.publish(
          TOPIC_EXCHANGE,
          VERIFICATION_DELETED_ROUTING_KEY,
          {
            ...rest,
            retryCount: retryCount + 1,
          },
        );
      } else {
        this.logger.error({
          message: 'Could not compensate',
          payload,
          exchange: TOPIC_EXCHANGE,
          queue: DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
          routingKey: VERIFICATION_DELETED_ROUTING_KEY,
        } as RabbitmqErrorLogger);
      }

      throw error;
    }
  }
}
