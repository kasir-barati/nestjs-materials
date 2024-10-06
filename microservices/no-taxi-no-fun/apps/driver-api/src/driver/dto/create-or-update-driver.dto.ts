import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressInformationDto } from './address.dto';
import { BankingInformationDto } from './banking-information.dto';
import { ContactInformationDto } from './contact-information.dto';
import { DriverLicenseDto } from './driver-license.dto';
import { VehicleDto } from './vehicle.dto';

export class CreateOrUpdateDriverDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Jan',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'Hakuya',
  })
  @IsString()
  @IsOptional()
  family?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '2024-09-11T11:58:55.011Z',
  })
  @IsDateString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'male',
  })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({
    type: ContactInformationDto,
    required: false,
  })
  @IsOptional()
  @Type(() => ContactInformationDto)
  @ValidateNested()
  contactInformation?: ContactInformationDto;

  @ApiProperty({
    type: AddressInformationDto,
    required: false,
  })
  @Type(() => AddressInformationDto)
  @ValidateNested()
  @IsOptional()
  addressInformation?: AddressInformationDto;

  @ApiProperty({
    type: DriverLicenseDto,
    required: false,
  })
  @Type(() => DriverLicenseDto)
  @ValidateNested()
  @IsOptional()
  driverLicense?: DriverLicenseDto;

  @ApiProperty({
    type: VehicleDto,
    required: false,
  })
  @Type(() => VehicleDto)
  @ValidateNested()
  @IsOptional()
  vehicle?: VehicleDto;

  @ApiProperty({
    type: BankingInformationDto,
    required: false,
  })
  @Type(() => BankingInformationDto)
  @ValidateNested()
  @IsOptional()
  bankingInformation?: BankingInformationDto;
}
