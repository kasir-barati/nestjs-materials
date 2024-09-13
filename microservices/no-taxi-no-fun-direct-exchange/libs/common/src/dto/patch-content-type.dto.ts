import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';

export class PatchContentTypeDto {
  @ApiProperty({
    type: String,
    example: 'application/merge-patch+json',
    default: 'application/merge-patch+json',
    description:
      'Here we are only following RFC7396. Thus it is necessary for you to send this header.',
  })
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  @IsIn(['application/merge-patch+json'])
  'content-type': string;
}
