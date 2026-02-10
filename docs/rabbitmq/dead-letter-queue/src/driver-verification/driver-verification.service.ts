import {
  AmqpConnection,
  RabbitPayload,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, UsePipes } from '@nestjs/common';
import { Types } from 'mongoose';

import {
  DRIVER_VERIFICATION_REQ_HEADER,
  DRIVER_VERIFICATION_REQ_QUEUE,
  DRIVER_VERIFICATION_REQ_RES_HEADER,
  DRIVER_VERIFICATION_REQ_RES_QUEUE,
  HEADERS_EXCHANGE,
  rabbitmqValidationPipe,
} from '../app.constant';
import {
  DriverVerificationRequestPayload,
  DriverVerificationRequestResponsePayload,
} from '../app.type';

@Injectable()
export class DriverVerificationService {
  private readonly logger = new Logger(DriverVerificationService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  @UsePipes(rabbitmqValidationPipe)
  @RabbitRPC({
    exchange: HEADERS_EXCHANGE,
    queue: DRIVER_VERIFICATION_REQ_QUEUE,
    routingKey: '',
    queueOptions: {
      arguments: {
        'x-match': 'any',
        'x-queue-type': 'quorum',
        [DRIVER_VERIFICATION_REQ_HEADER]: DRIVER_VERIFICATION_REQ_QUEUE,
      },
      bindQueueArguments: {
        'x-match': 'any',
        [DRIVER_VERIFICATION_REQ_HEADER]: DRIVER_VERIFICATION_REQ_QUEUE,
      },
    },
  })
  async driverVerificationRequest(
    @RabbitPayload() payload: DriverVerificationRequestPayload,
  ): Promise<void> {
    this.logger.log(
      `driver verification request queue (first queue), payload: ${JSON.stringify(
        payload,
        null,
        2,
      )}`,
    );

    const message: InstanceType<
      typeof DriverVerificationRequestResponsePayload
    > = {
      verificationId: new Types.ObjectId().toString(),
      driverId: payload.driverId,
    };

    await this.amqpConnection.publish(HEADERS_EXCHANGE, '', message, {
      headers: {
        [DRIVER_VERIFICATION_REQ_RES_HEADER]: DRIVER_VERIFICATION_REQ_RES_QUEUE,
      },
    });
  }
}
