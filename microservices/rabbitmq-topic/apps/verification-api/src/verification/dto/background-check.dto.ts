import { ApiProperty } from '@nestjs/swagger';
import { BackgroundCheckStatus } from '../../verification-api.type';

export class BackgroundCheckDto {
  @ApiProperty({
    type: String,
    enum: BackgroundCheckStatus,
    example: BackgroundCheckStatus.approved,
  })
  status: BackgroundCheckStatus;

  @ApiProperty({
    type: String,
    example: 'Some shady 3rd-party company!',
  })
  provider: string;

  @ApiProperty({
    type: String,
    isArray: true,
    example: [
      'https://example.com/upload/background-check/66e089275e62d61d072eebdf/filename.pdf',
    ],
  })
  attachments: string[];
}
