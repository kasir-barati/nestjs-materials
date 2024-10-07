import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { BackgroundCheckDto } from './background-check.dto';
import { DrivingLicenseVerificationDto } from './driving-license-verification.dto';
import { IdentityVerificationDto } from './identity-verification.dto';
import { VehicleVerificationDto } from './vehicle-verification.dto';

export class ReadVerificationDto {
  @ApiProperty({
    type: String,
    example: '66e08c602587ac2b1664a9ce',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: '66e0887144e73403e6bb3a69',
  })
  driverId: string;

  @ApiProperty({
    type: BackgroundCheckDto,
    description: 'Background check of this driver info.',
  })
  backgroundCheck?: BackgroundCheckDto;

  @ApiProperty({
    type: IdentityVerificationDto,
    description: "Background check of this driver's identity info.",
  })
  identityVerification?: IdentityVerificationDto;

  @ApiProperty({
    type: DrivingLicenseVerificationDto,
    description: 'Driver license verification result.',
  })
  drivingLicenseVerification?: DrivingLicenseVerificationDto;

  @ApiProperty({
    type: VehicleVerificationDto,
    description: 'Vehicle verification info.',
  })
  vehicleVerification?: VehicleVerificationDto;

  @ApiProperty({
    type: [String],
    description: 'Some notes about the verification.',
    example: [
      'First verification failed and had to be performed by our customer support manually.',
    ],
  })
  notes?: string;
}
