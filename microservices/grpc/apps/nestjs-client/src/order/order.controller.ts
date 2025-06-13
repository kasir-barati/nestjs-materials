import { CurrentUser, GetCurrentUser } from '@grpc/shared';
import { Controller, HttpCode, Param, Post } from '@nestjs/common';
import { IsUUID } from 'class-validator';

import { UserService } from '../user/user.service';

class ProcessedOrderId {
  @IsUUID()
  id: string;
}

@Controller('orders')
export class OrderController {
  constructor(private userService: UserService) {}

  @Post(':id/processed')
  @HttpCode(200)
  async processed(
    @Param() { id }: ProcessedOrderId,
    @GetCurrentUser() user: CurrentUser,
  ) {
    await this.userService.postProcessedOrderActions(id, user);

    return;
  }
}
