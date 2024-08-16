import { Pagination } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Reservation } from '../entities/reservation.entity';

export class CreatedReservationDto implements Reservation {
  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
    description: 'Check out date.',
  })
  end: Date;

  @ApiProperty({
    type: String,
    example: new Date().toISOString(),
    description: 'Check in date.',
  })
  start: Date;

  @ApiProperty({
    type: String,
    example: '66be189e84b4100aa12a23b5',
    description: 'Reference to user which booked this reservation.',
  })
  userId: string;

  @ApiProperty({
    type: String,
    example: '66be18afc94995c7e2678c7f',
    description: 'Reference to invoice for this reservation.',
  })
  invoiceId: string;

  @ApiProperty({
    type: String,
    example: '66be18b3a52f121b9a88cd5d',
    description: 'Reference to where this reservation is located.',
  })
  locationId: string;

  @ApiProperty({
    type: String,
    example: '66be18b7e65c0f0ee44da579',
    description: 'Reservation ID.',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: new Date().toString(),
    description: 'Created at.',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    example: new Date().toString(),
    description: 'Updated at.',
  })
  updatedAt: Date;
}

export class ReadReservationDto extends CreatedReservationDto {}

export class ReadReservationsDto implements Pagination<Reservation> {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  page: number;

  @ApiProperty({
    type: Number,
    example: 10,
  })
  limit: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  total: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  lastPage: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  prev: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  next: number;

  @ApiProperty({
    type: ReadReservationDto,
    isArray: true,
    example: 10,
  })
  data: ReadReservationDto[];
}

export class PatchedReservationDto extends CreatedReservationDto {}
