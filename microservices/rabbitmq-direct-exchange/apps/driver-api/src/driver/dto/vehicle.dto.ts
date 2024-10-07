import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class VehicleDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Toyota',
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Corolla',
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '1990-09-11T12:14:33.401Z',
  })
  @IsDateString()
  @IsOptional()
  manufactureDate?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'P688CC',
  })
  @IsDateString()
  @IsOptional()
  licensePlateNumber?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '1HGBH41JXMN109186',
  })
  @IsDateString()
  @IsOptional()
  vehicleIdentificationNumber: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'A123456780',
  })
  @IsDateString()
  @IsOptional()
  insuranceId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2026-09-11T12:08:12.813Z',
  })
  @IsDateString()
  @IsOptional()
  insuranceExpirationDate: string;

  @ApiProperty({
    type: String,
    required: false,
    example:
      'https://example-uploads.s3.amazonaws.com/uploads/drivers-insurance/sdv412.png',
  })
  @IsDateString()
  @IsOptional()
  insurancePicture: string;
}
