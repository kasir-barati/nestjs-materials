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
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReplaceReservationDto } from './dto/replace-reservation.dto';
import {
  CreatedReservationDto,
  PatchedReservationDto,
  ReadReservationDto,
  ReadReservationsDto,
  ReplacedReservationDto,
} from './dto/response.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationService } from './reservation.service';

@ApiTags('Reservation service')
@Controller('reservations')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
  ) {}

  @ApiOperation({
    summary: 'Create a new reservation',
    description:
      'Create a new reservation based on the request body.',
  })
  @ApiCreatedResponse({
    type: CreatedReservationDto,
    description: 'Returns created reservation.',
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
  @Put()
  create(
    @GetUser() user: AttachedUserToTheRequest,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<CreatedReservationDto> {
    return this.reservationService.create(
      user._id,
      createReservationDto,
    );
  }

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
    summary: 'Patch a reservation.',
    description:
      "Patch a reservation by id. You need to specify the 'content-type' header to 'application/merge-patch+json'. Note: since all the fields for reservation are required you cannot possibly send null to remove a field.",
  })
  @ApiOkResponse({
    type: PatchedReservationDto,
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
  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @GetHeader() _: PatchContentTypeDto,
  ): Promise<PatchedReservationDto> {
    return this.reservationService.update(id, updateReservationDto);
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
  delete(@Param('id', MongoIdPipe) id: string): Promise<void> {
    return this.reservationService.delete(id);
  }
}
