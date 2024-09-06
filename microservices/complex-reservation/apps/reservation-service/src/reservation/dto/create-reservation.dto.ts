import { PartialChargeMicroservicesPayload } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class CreateOrUpdateReservationDto extends PartialChargeMicroservicesPayload {
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
    example: '66be1677c5c26e0597c9cba7',
    description: "This reservation's location id.",
  })
  @IsOptional()
  @IsMongoId()
  locationId?: string;
}
