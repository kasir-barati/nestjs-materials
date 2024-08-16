import { MongoIdPipe } from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
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
import {
  CreatedReservationDto,
  PatchedReservationDto,
  ReadReservationDto,
  ReadReservationsDto,
} from './dto/response.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationService } from './reservation.service';

@ApiTags('Reservation service')
@Controller('reservation')
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
  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<CreatedReservationDto> {
    return this.reservationService.create(
      'user id', // TODO: extract it from req.
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
  @Get(':id')
  findById(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<ReadReservationDto> {
    return this.reservationService.findById(id);
  }

  @ApiOperation({
    summary: 'Patch a reservation.',
    description: 'Patch a reservation by id.',
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
  @Patch(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<PatchedReservationDto> {
    return this.reservationService.update(id, updateReservationDto);
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
  @Delete(':id')
  delete(@Param('id', MongoIdPipe) id: string): Promise<void> {
    return this.reservationService.delete(id);
  }
}
