import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';
import { strongPasswordConf } from '../constants/password.constant';

export class CreateOrUpdateUserDto {
  @ApiProperty({
    type: String,
    description:
      'Email of user. Required only in case that user wanna register.',
    required: false,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description:
      'Requirements: minimum length: 8, minimum number character: 1, minimum lowercase character: 1. Required only in case that user wanna register.',
    required: false,
  })
  @IsStrongPassword(strongPasswordConf)
  password: string;
}
