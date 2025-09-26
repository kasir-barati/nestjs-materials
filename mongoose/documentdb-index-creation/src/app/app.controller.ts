import { Controller, Get } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { AppService } from './services';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getHello() {
    return await this.appService.getHello();
  }

  @Get('users')
  async getUsers() {
    return await this.userService.users();
  }
}
