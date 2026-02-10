import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

import {
  DRIVER_VERIFICATION_REQ_HEADER,
  DRIVER_VERIFICATION_REQ_QUEUE,
  HEADERS_EXCHANGE,
} from './app.constant';
import { DriverVerificationRequestPayload } from './app.type';

@ApiTags('App')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  @ApiOperation({
    description: `Send a message to ${DRIVER_VERIFICATION_REQ_QUEUE}.`,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error.',
  })
  @Get()
  async sendMessageToDriverVerificationReqQueue() {
    this.logger.log('controller');

    // Here I wanna send a message to a queue which bound to the specified header.
    // But instead I am getting:
    const message: DriverVerificationRequestPayload = {
      driverId: new Types.ObjectId().toString(),
    };

    await this.amqpConnection.publish(HEADERS_EXCHANGE, '', message, {
      headers: {
        [DRIVER_VERIFICATION_REQ_HEADER]: DRIVER_VERIFICATION_REQ_QUEUE,
      },
    });
  }
}
