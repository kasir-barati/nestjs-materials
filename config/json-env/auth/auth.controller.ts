import { Body, Controller, Post } from '@nestjs/common';
import { T } from './t.dto';

@Controller('auth')
export class AuthController {
  @Post()
  test(@Body() t: T) {
    console.log(t);
  }
}
