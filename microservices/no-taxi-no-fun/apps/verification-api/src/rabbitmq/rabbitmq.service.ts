import {
  DIRECT_EXCHANGE,
  DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
  DRIVER_VERIFICATION_REQ_QUEUE,
  DRIVER_VERIFICATION_REQ_RES_QUEUE,
  DriverVerificationRequestCompensatePayload,
  DriverVerificationRequestPayload,
  DriverVerificationRequestResponsePayload,
  rabbitmqValidationPipe,
} from '@app/common';
import {
  AmqpConnection,
  RabbitPayload,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, UsePipes } from '@nestjs/common';
import { Verification } from '../verification/entities/verification.entity';
import { VerificationRepository } from '../verification/repository/verification.repository';

@Injectable()
export class RabbitmqService {
  constructor(
    private readonly verificationRepository: VerificationRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @UsePipes(rabbitmqValidationPipe)
  @RabbitRPC({
    exchange: DIRECT_EXCHANGE,
    queue: DRIVER_VERIFICATION_REQ_QUEUE,
    routingKey: DRIVER_VERIFICATION_REQ_QUEUE,
  })
  async driverVerificationRequest(
    @RabbitPayload() payload: DriverVerificationRequestPayload,
  ): Promise<void> {
    let verification: Verification;
    try {
      verification = await this.verificationRepository.create({
        driverId: payload.driverId,
      });

      await this.amqpConnection.publish<DriverVerificationRequestResponsePayload>(
        DIRECT_EXCHANGE,
        DRIVER_VERIFICATION_REQ_RES_QUEUE,
        {
          verificationId: verification._id.toString(),
          driverId: payload.driverId,
        },
      );
    } catch (error) {
      if (verification) {
        await this.verificationRepository.delete(
          verification._id.toString(),
        );
      }

      await this.amqpConnection.publish<DriverVerificationRequestCompensatePayload>(
        DIRECT_EXCHANGE,
        DRIVER_VERIFICATION_REQ_COMPENSATE_QUEUE,
        {
          driverId: payload.driverId,
        },
      );

      throw error;
    }
  }
}
