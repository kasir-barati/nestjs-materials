import {
  DIRECT_EXCHANGE,
  DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
  DRIVER_VERIFICATION_REQ_RES_QUEUE,
  DriverVerificationRequestCompensatePayload,
  DriverVerificationRequestResponsePayload,
  RabbitmqErrorLogger,
  rabbitmqValidationPipe,
} from '@app/common';
import {
  AmqpConnection,
  RabbitPayload,
  RabbitRPC,
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
  @RabbitRPC({
    exchange: DIRECT_EXCHANGE,
    queue: DRIVER_VERIFICATION_REQ_RES_QUEUE,
    routingKey: DRIVER_VERIFICATION_REQ_RES_QUEUE,
  })
  async driverVerificationReqResponse(
    @RabbitPayload()
    payload: DriverVerificationRequestResponsePayload,
  ) {
    try {
      await this.driverRepository.update(payload.driverId, {
        verificationId: payload.verificationId,
      });
    } catch (error) {
      const { retryCount = 4, ...rest } = payload;

      if (retryCount > 0) {
        await this.amqpConnection.publish<DriverVerificationRequestResponsePayload>(
          DIRECT_EXCHANGE,
          DRIVER_VERIFICATION_REQ_RES_QUEUE,
          {
            ...rest,
            retryCount: retryCount - 1,
          },
        );
      } else {
        this.logger.error({
          message: 'Could not process verification request response',
          payload,
          exchange: DIRECT_EXCHANGE,
          queue: DRIVER_VERIFICATION_REQ_RES_QUEUE,
        } as RabbitmqErrorLogger);
      }

      throw error;
    }
  }

  @UsePipes(rabbitmqValidationPipe)
  @RabbitRPC({
    exchange: DIRECT_EXCHANGE,
    queue: DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
    routingKey: DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
  })
  async driverVerificationReqCompensate(
    @RabbitPayload()
    payload: DriverVerificationRequestCompensatePayload,
  ) {
    try {
      await this.driverRepository.delete(payload.driverId);
    } catch (error) {
      const { retryCount = 4, ...rest } = payload;

      if (retryCount > 0) {
        await this.amqpConnection.publish<DriverVerificationRequestCompensatePayload>(
          DIRECT_EXCHANGE,
          DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
          {
            ...rest,
            retryCount: retryCount - 1,
          },
        );
      } else {
        this.logger.error({
          message: 'Could not compensate',
          payload,
          exchange: DIRECT_EXCHANGE,
          queue: DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
        } as RabbitmqErrorLogger);
      }

      throw error;
    }
  }
}
