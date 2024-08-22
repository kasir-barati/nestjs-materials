import {
  AttachedUserToTheRequest,
  AuthenticateMicroservicesPayload,
  GetUser,
  MESSAGE_PATTERN_FOR_AUTHENTICATION_FLOW,
} from '@app/common';
import {
  BadRequestException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthServiceService } from './auth-service.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

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
    @GetUser() user: AttachedUserToTheRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authServiceService.login(user, response);

    response.send();
  }

  /**
   * This message handler listens for messages that fulfill the MESSAGE_PATTERN_FOR_AUTHENTICATION_FLOW message pattern.
   * @returns the user attached to the request object. This user was attached in our JWT strategy to the request object. And now the client has the user info returned from this message handler. Note that here we are only checking whether user is authenticated or not in our JWT auth guard.
   */
  @UseGuards(JwtAuthGuard)
  @MessagePattern(MESSAGE_PATTERN_FOR_AUTHENTICATION_FLOW)
  async authenticate(
    @Payload() data: AuthenticateMicroservicesPayload,
  ): Promise<AttachedUserToTheRequest> {
    return data.user;
  }
}
