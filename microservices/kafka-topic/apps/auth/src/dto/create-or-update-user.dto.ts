import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

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
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    // You have to do this step since default values are 1
    // https://github.com/validatorjs/validator.js/blob/master/src/lib/isStrongPassword.js
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;
}
