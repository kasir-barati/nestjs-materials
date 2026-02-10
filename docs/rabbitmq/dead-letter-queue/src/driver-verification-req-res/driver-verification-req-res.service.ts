import { RabbitPayload, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, UsePipes } from '@nestjs/common';

import {
  DRIVER_VERIFICATION_REQ_RES_HEADER,
  DRIVER_VERIFICATION_REQ_RES_QUEUE,
  HEADERS_EXCHANGE,
  rabbitmqValidationPipe,
} from '../app.constant';
import { DriverVerificationRequestResponsePayload } from '../app.type';

@Injectable()
export class DriverVerificationReqResService {
  private readonly logger = new Logger(DriverVerificationReqResService.name);

  @UsePipes(rabbitmqValidationPipe)
  @RabbitRPC({
    exchange: HEADERS_EXCHANGE,
    queue: DRIVER_VERIFICATION_REQ_RES_QUEUE,
    queueOptions: {
      arguments: {
        'x-queue-type': 'quorum',
      },
      bindQueueArguments: {
        'x-match': 'any',
        [DRIVER_VERIFICATION_REQ_RES_HEADER]: DRIVER_VERIFICATION_REQ_RES_QUEUE,
      },
    },
  })
  async driverVerificationReqResponse(
    @RabbitPayload()
    payload: InstanceType<typeof DriverVerificationRequestResponsePayload>,
  ) {
    this.logger.log(payload);
  }
}
