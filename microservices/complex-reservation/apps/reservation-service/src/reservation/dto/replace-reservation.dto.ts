import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId } from 'class-validator';

export class ReplaceReservationDto {
  @ApiProperty({
    type: String,
    required: true,
    example: new Date().toISOString(),
    description: 'In which date user will check out?',
  })
  @IsDateString()
  end: string;

  @ApiProperty({
    type: String,
    required: true,
    example: new Date().toISOString(),
    description: 'In which date user will check in?',
  })
  @IsDateString()
  start: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '66be1648e0cf5a3b4db5b18e',
    description: "This reservation's invoice id.",
  })
  @IsMongoId()
  invoiceId: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '66be1677c5c26e0597c9cba7',
    description: "This reservation's location id.",
  })
  @IsMongoId()
  locationId: string;
}
