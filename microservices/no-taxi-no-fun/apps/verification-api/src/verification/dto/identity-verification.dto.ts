import { ApiProperty } from '@nestjs/swagger';
import { IdentityVerificationStatus } from '../../verification-api.type';

export class IdentityVerificationDto {
  @ApiProperty({
    type: String,
    example: 'Passport',
    description: 'It can be passport, id card, driver license, etc.',
  })
  documentType: string;

  @ApiProperty({
    type: String,
    example: 'OA1408167',
    description: 'It can be Passport ID or identity card unique ID.',
  })
  documentNumber: string;

  @ApiProperty({
    type: String,
    example: 'http://example.com/uploads/whaever.png',
  })
  documentPicture: string;

  @ApiProperty({
    type: String,
    enum: IdentityVerificationStatus,
    example: IdentityVerificationStatus.failed,
  })
  status: IdentityVerificationStatus;

  @ApiProperty({
    type: String,
    example: '2024-09-29T11:58:55.011Z',
    description:
      "In which date we've got our answers regarding the authenticity of driver's identity document.",
  })
  completedAt?: string;
}
