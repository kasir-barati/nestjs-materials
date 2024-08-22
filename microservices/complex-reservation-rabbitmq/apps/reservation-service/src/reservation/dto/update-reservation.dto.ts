import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class UpdateReservationDto {
  @ApiProperty({
    type: String,
    required: false,
    example: new Date().toISOString(),
    description: 'In which date user will check out?',
  })
  @IsOptional()
  @IsDateString()
  end?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: new Date().toISOString(),
    description: 'In which date user will check in?',
  })
  @IsOptional()
  @IsDateString()
  start?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '66be1648e0cf5a3b4db5b18e',
    description: "This reservation's invoice id.",
  })
  @IsOptional()
  @IsMongoId()
  invoiceId?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '66be1677c5c26e0597c9cba7',
    description: "This reservation's location id.",
  })
  @IsOptional()
  @IsMongoId()
  locationId?: string;
}
