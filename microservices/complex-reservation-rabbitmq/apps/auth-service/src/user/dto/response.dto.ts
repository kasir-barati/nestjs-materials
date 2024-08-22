import { ApiProperty } from '@nestjs/swagger';

export class MeDto {
  @ApiProperty({
    type: String,
    description: 'User id',
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    type: Date,
    description: 'When user was created.',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "When user's info was updated last time.",
  })
  updatedAt: Date;
}
