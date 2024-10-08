import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class DriverLicenseDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'F25592150094',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Florida',
  })
  @IsString()
  @IsOptional()
  issuerState?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2025-09-11T11:58:55.011Z',
  })
  @IsDateString()
  @IsOptional()
  expirationDate?: String;

  @ApiProperty({
    type: String,
    required: false,
    example: 'AM',
    description:
      'For a complete list look at [this page](https://bmdv.bund.de/SharedDocs/EN/Articles/StV/Roadtraffic/driving-licence-categories-overview.html).',
  })
  classification?: string;

  @ApiProperty({
    type: String,
    required: false,
    example:
      'https://example-uploads.s3.amazonaws.com/uploads/drivers-license/123sdv42.png',
  })
  @IsString()
  @IsOptional()
  picture?: string;
}
