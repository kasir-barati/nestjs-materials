import { ApiProperty } from '@nestjs/swagger';

export class CreatedOrUpdatedUserDto {
  @ApiProperty({
    type: String,
    description: "User's ID.",
    example: '66ef15e6f14ac3b18bf642b6',
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: "User's email address.",
    example: 'some.random.email@address.cn',
  })
  email: String;
}
