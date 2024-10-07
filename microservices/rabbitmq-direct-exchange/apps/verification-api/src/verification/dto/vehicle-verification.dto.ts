import { ApiProperty } from '@nestjs/swagger';
import {
  InsuranceVerificationStatus,
  VehicleVerificationStatus,
} from '../../verification-api.type';

export class VehicleVerificationDto {
  @ApiProperty({
    type: String,
    enum: VehicleVerificationStatus,
    example: VehicleVerificationStatus.approved,
  })
  status: VehicleVerificationStatus;

  @ApiProperty({
    type: String,
    example: '2020-09-11T11:58:55.011Z',
  })
  inspectionDate?: string;

  @ApiProperty({
    type: String,
    example:
      'This car is examined and is in perfect condition. Next examination date would be 2100.01.01.',
  })
  inspectionReport?: string;

  @ApiProperty({
    type: String,
    enum: InsuranceVerificationStatus,
    example: InsuranceVerificationStatus.failed,
  })
  insuranceVerificationStatus: InsuranceVerificationStatus;
}
