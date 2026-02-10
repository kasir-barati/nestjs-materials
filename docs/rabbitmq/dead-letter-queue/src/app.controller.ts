import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Controller,
  Headers,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

@ApiTags('App')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  @ApiOperation({
    description: `Register a new user.`,
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error.',
  })
  @Post('users')
  async createUser(
    @Headers('correlation-id') correlationId: string = randomUUID(),
  ): Promise<void> {
    const message = {
      messageId: randomUUID(),
      userInfo: {
        id: randomUUID(),
        name: 'John Doe',
      },
    };
    const headers = {
      'x-delivery-count': 0,
      'correlation-id': correlationId,
    };

    this.logger.log(
      `Message: ${JSON.stringify(message)}, headers: ${JSON.stringify(headers)}`,
    );

    await this.amqpConnection.publish('events', 'user.registered', message, {
      headers,
    });
  }
}
