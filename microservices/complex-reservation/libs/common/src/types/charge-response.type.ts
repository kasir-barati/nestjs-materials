import { ApiProperty } from '@nestjs/swagger';

export class ChargeResponseDto {
  @ApiProperty({
    type: String,
    description: 'Payment id which we can use as invoice id.',
    example: 'pi_asd12312asdASD12312sadas',
  })
  id: string;
}
