import { GetUser, User } from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { MeDto } from './dto/response.dto';
import { UserSerializer } from './user.serializer';
import { UserService } from './user.service';

@ApiTags('User service')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userSerializer: UserSerializer,
  ) {}

  @ApiOperation({
    summary: 'Create a new reservation',
    description:
      'Create a new reservation based on the request body.',
  })
  @ApiCreatedResponse({
    type: String,
    description: 'Returns created user id.',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad request.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @Put()
  create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.userService.create(createUserDto);
  }

  @ApiOkResponse({
    type: MeDto,
    description: 'Return user info.',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad request.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@GetUser() user: User): Promise<MeDto> {
    const data = await this.userService.findById(user._id);
    const serializedData = this.userSerializer.serializeMe(data);

    return serializedData;
  }
}
