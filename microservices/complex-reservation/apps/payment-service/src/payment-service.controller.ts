import {
  ChargeMicroservicesPayload,
  ChargeResponseDto,
  MESSAGE_PATTERN_FOR_CHARGING_USER,
} from '@app/common';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcValidationFilter } from './filters/rpc-validation.filter';
import { PaymentServiceService } from './payment-service.service';

@Controller()
export class PaymentServiceController {
  constructor(
    private readonly paymentServiceService: PaymentServiceService,
  ) {}

  @UseFilters(new RpcValidationFilter())
  @MessagePattern(MESSAGE_PATTERN_FOR_CHARGING_USER)
  charge(
    @Payload() data: ChargeMicroservicesPayload,
  ): Promise<ChargeResponseDto> {
    return this.paymentServiceService.charge(data);
  }
}
