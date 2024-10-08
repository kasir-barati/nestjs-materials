import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AnyOf } from '../decorators/any-of.decorator';
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
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    type: Number,
    example: 1231231,
    description: 'Cost of reservation.',
  })
  @IsInt()
  amount: number;
}

@AnyOf(['html', 'text'])
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

  @ApiProperty({
    type: Number,
    example: '3',
    description:
      "How many times it should be retried. You do not need to specify this. It'll be managed & added by DLQ service.",
  })
  @IsInt()
  @IsOptional()
  retryCount?: number;
}
