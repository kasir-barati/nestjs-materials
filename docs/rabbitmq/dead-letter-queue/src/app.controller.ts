import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Controller,
  Headers,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';

import { CustomLoggerService } from './modules';
import { GenericUserEvent } from './shared';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly logger: CustomLoggerService,
  ) {}

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
    const message: GenericUserEvent<{ id: string; name: string }> = {
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
      { context: AppController.name, correlationId },
    );

    await this.amqpConnection.publish('events', 'user.registered', message, {
      headers,
    });
  }
}
