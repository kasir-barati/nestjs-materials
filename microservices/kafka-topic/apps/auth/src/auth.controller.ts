import {
  GetHeader,
  MongoIdPipe,
  PatchContentTypeDto,
} from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Patch,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthSerializer } from './auth.serializer';
import { CreateOrUpdateUserDto } from './dto/create-or-update-user.dto';
import { CreatedOrUpdatedUserDto } from './dto/created-or-updated-user.dto';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authSerializer: AuthSerializer,
  ) {}

  @ApiOperation({
    summary: 'Create or update a user resource.',
    description:
      "Create or update a user by id. You need to specify the 'content-type' header to 'application/merge-patch+json'. Note: since all the fields for driver are required you cannot possibly send null to remove a field.",
  })
  @ApiParam({
    name: 'id',
    description: "User's ID",
    example: '66ef156b0406bc2cabcc92b8',
  })
  @ApiOkResponse({
    type: CreatedOrUpdatedUserDto,
    description: 'Returns the updated user resource.',
  })
  @ApiCreatedResponse({
    type: CreatedOrUpdatedUserDto,
    description: 'Returns created driver resource.',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad request.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @Patch(':id')
  async createOrUpdateUser(
    @Param('id', MongoIdPipe) id: string,
    @Body()
    createOrUpdateUserDto: CreateOrUpdateUserDto,
    @GetHeader() _: PatchContentTypeDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.authService.createOrUpdateUser({
      id,
      createOrUpdateUserDto,
      requestId: request.id.toString(),
    });
    const serializedData =
      this.authSerializer.toCreatedOrUpdatedUserDto(result.data);

    response
      .status(result.status === 'created' ? 201 : 200)
      .send(serializedData);
  }
}
