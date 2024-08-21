import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
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
