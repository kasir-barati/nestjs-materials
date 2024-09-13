import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddressInformationDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Nathan Rd, ',
  })
  @IsString()
  @IsOptional()
  street: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Yau Ma Tei',
  })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Hong Kong',
  })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '494-496',
  })
  @IsString()
  @IsOptional()
  zip: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'China',
  })
  @IsString()
  @IsOptional()
  country: string;
}
