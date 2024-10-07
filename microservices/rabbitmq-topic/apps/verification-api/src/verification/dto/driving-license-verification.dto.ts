import { ApiProperty } from '@nestjs/swagger';
import { LicenseVerificationStatus } from '../../verification-api.type';

export class DrivingLicenseVerificationDto {
  @ApiProperty({
    type: String,
    enum: LicenseVerificationStatus,
    example: LicenseVerificationStatus.pending,
  })
  status: LicenseVerificationStatus;

  @ApiProperty({
    type: String,
    example: 'Company XYZ',
  })
  provider: string;

  @ApiProperty({
    type: String,
    example: '2025-09-11T11:58:55.011Z',
  })
  completedAt?: string;
}
