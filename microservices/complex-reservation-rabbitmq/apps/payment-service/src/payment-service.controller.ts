import {
  ChargeMicroservicesPayload,
  ChargeResponseDto,
  MESSAGE_PATTERN_FOR_CHARGING_USER,
  RpcValidationFilter,
} from '@app/common';
import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';
import { PaymentServiceService } from './payment-service.service';

@Controller()
export class PaymentServiceController {
  constructor(
    private readonly paymentServiceService: PaymentServiceService,
  ) {}

  @UsePipes(
    new ValidationPipe({
      errorHttpStatusCode: 400,
      whitelist: true,
      transform: true,
    }),
  )
  @UseFilters(new RpcValidationFilter())
  @MessagePattern(MESSAGE_PATTERN_FOR_CHARGING_USER)
  async charge(
    @Payload() payload: ChargeMicroservicesPayload,
    @Ctx() context: RmqContext,
  ): Promise<ChargeResponseDto> {
    const channel: Channel = context.getChannelRef();
    const message = context.getMessage() as Message;
    const response = await this.paymentServiceService.charge({
      payload,
      channel,
      message,
    });

    return response;
  }
}
