import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AddressInformationDto } from './address.dto';
import { BankingInformationDto } from './banking-information.dto';
import { ContactInformationDto } from './contact-information.dto';
import { DriverLicenseDto } from './driver-license.dto';
import { VehicleDto } from './vehicle.dto';

export class CreatedOrUpdatedDriverDto {
  @ApiProperty({ type: String, example: '66e085dfb17d0d208eedf05d' })
  _id: Types.ObjectId | string;

  @ApiProperty({ type: String, description: "Driver's full name." })
  name: string;

  @ApiProperty({ type: String })
  family: string;

  @ApiProperty({ type: String, example: '2004-09-11T11:58:55.011Z' })
  birthday?: Date;

  @ApiProperty({ type: String })
  gender: string;

  @ApiProperty({
    type: String,
    description:
      "Verification ID. Generally it should not be empty unless we've just have created the driver.",
  })
  verificationId?: string;

  @ApiProperty({ type: ContactInformationDto })
  contactInformation?: ContactInformationDto;

  @ApiProperty({ type: AddressInformationDto })
  addressInformation?: AddressInformationDto;

  @ApiProperty({ type: DriverLicenseDto })
  driverLicense?: DriverLicenseDto;

  @ApiProperty({ type: VehicleDto })
  vehicle?: VehicleDto;

  @ApiProperty({ type: BankingInformationDto })
  bankingInformation?: BankingInformationDto;

  @ApiProperty({
    type: String,
    example: '2023-09-11T11:58:55.011Z',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    example: '2024-09-11T11:51:55.011Z',
  })
  updatedAt: string;
}

export class FindByIdDriverDto extends CreatedOrUpdatedDriverDto {}
