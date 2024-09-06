import {
  AttachedUserToTheRequest,
  GetHeader,
  GetUser,
  JwtAuthGuard,
  MongoIdPipe,
  PatchContentTypeDto,
} from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Put,
  Res,
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
import { Response } from 'express';
import { CreateOrUpdateReservationDto } from './dto/create-reservation.dto';
import { ReplaceReservationDto } from './dto/replace-reservation.dto';
import {
  CreatedOrUpdatedReservationDto,
  ReadReservationDto,
  ReadReservationsDto,
  ReplacedReservationDto,
} from './dto/response.dto';
import { ReservationService } from './reservation.service';

@ApiTags('Reservation service')
@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
  ) {}

  @ApiOperation({
    summary: 'Fetch reservations.',
    description: 'Fetch reservations.',
  })
  @ApiOkResponse({
    type: ReadReservationsDto,
    description: 'Returns reservations.',
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
  @Get()
  read(): Promise<ReadReservationsDto> {
    return this.reservationService.read();
  }

  @ApiOperation({
    summary: 'Fetch a reservation.',
    description: 'Fetch a reservation by id.',
  })
  @ApiOkResponse({
    type: ReadReservationDto,
    description: 'Returns the reservation.',
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
  @Get(':id')
  findById(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<ReadReservationDto> {
    return this.reservationService.findById(id);
  }

  @ApiOperation({
    summary: 'Create or update a reservation resource.',
    description:
      "Create or update a reservation by id. You need to specify the 'content-type' header to 'application/merge-patch+json'. Note: since all the fields for reservation are required you cannot possibly send null to remove a field.",
  })
  @ApiOkResponse({
    type: CreatedOrUpdatedReservationDto,
    description: 'Returns the updated reservation resource.',
  })
  @ApiCreatedResponse({
    type: CreatedOrUpdatedReservationDto,
    description: 'Returns created reservation resource.',
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
  @Patch(':id')
  async createOrUpdate(
    @Param('id', MongoIdPipe) id: string,
    @GetUser() user: AttachedUserToTheRequest,
    @Body()
    createOrUpdateReservationDto: CreateOrUpdateReservationDto,
    @GetHeader() _: PatchContentTypeDto,
    @Res() response: Response,
  ) {
    const { status, data } =
      await this.reservationService.createOrUpdate({
        id,
        user,
        createOrUpdateReservationDto,
      });

    response.status(status === 'created' ? 201 : 200).send(data);
  }

  @ApiOperation({
    summary: 'Update a reservation.',
    description:
      'Replace old data of a reservation with the new data.',
  })
  @ApiOkResponse({
    type: ReplacedReservationDto,
    description: 'Returns the updated version.',
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
  @Put(':id')
  replace(
    @Param('id', MongoIdPipe) id: string,
    @Body() replaceReservationDto: ReplaceReservationDto,
  ) {
    return this.reservationService.update(id, replaceReservationDto);
  }

  @ApiOperation({
    summary: 'Delete a reservation.',
    description: 'Delete a reservation by id.',
  })
  @ApiOkResponse({
    description: 'Returns nothing.',
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
  @Delete(':id')
  async delete(
    @Param('id', MongoIdPipe) id: string,
    @Res() response: Response,
  ): Promise<void> {
    const isDeleted = await this.reservationService.delete(id);

    if (isDeleted) {
      response.status(200).send();
      return;
    }

    response.status(204).send();
  }
}
