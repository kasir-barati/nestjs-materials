import { CurrentUser, GetCurrentUser } from '@grpc/shared';
import { Controller, HttpCode, Param, Post } from '@nestjs/common';

import { UserService } from '../user/user.service';

@Controller('orders')
export class OrderController {
  constructor(private userService: UserService) {}

  @Post(':id/processed')
  @HttpCode(200)
  async processed(
    @Param('id') id: string,
    @GetCurrentUser() user: CurrentUser
  ) {
    await this.userService.postProcessedOrderActions(id, user);

    return;
  }
}
