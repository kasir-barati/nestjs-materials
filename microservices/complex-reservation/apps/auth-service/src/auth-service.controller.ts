import { GetUser, User } from '@app/common';
import {
  BadRequestException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthServiceService } from './auth-service.service';
import { LocalAuthGuard } from './guards/local-auth-guard';

@ApiTags('Auth service')
@Controller('auth')
export class AuthServiceController {
  constructor(
    private readonly authServiceService: AuthServiceService,
  ) {}

  @ApiOkResponse({
    description:
      'Generate JWT tokens and attach them to the response cookies based on provided email and password.',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad request.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authServiceService.login(user, response);

    response.send();
  }
}
