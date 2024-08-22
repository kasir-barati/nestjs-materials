import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString } from 'class-validator';
import { AttachedUserToTheRequest } from './attached-user-to-the-request.type';

export interface AuthenticateMicroservicesPayload {
  Authentication: string;
  user: AttachedUserToTheRequest;
}

export class ChargeMicroservicesPayload {
  @ApiProperty({
    type: String,
    required: true,
    description:
      'Token generated in the client-side app from the credit card info.',
    example: 'tok_someId',
  })
  @IsString()
  token: string;

  @ApiProperty({
    type: Number,
    example: 1231231,
    description: 'Cost of reservation.',
  })
  @IsInt()
  amount: number;
}

export class EmailNotificationMicroservicesPayload {
  @ApiProperty({
    type: String,
    example: 'm.jawad.b.khorasani@gmail.com',
    description: 'Notify user on this email address.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '<h1>header</h1>',
    description: 'The HTML version of the notification.',
  })
  @IsString()
  html?: string;

  @ApiProperty({
    type: String,
    example: 'header',
    description: 'The plain text version of the notification.',
  })
  @IsString()
  text?: string;
}
