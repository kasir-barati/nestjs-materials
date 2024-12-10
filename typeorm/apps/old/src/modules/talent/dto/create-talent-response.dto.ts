import { ApiProperty } from '@nestjs/swagger';

export class CreateTalentResponseDto {
  @ApiProperty({
    example: 'b3a37d32-2593-4f52-b873-bbb89c4b493c',
    description: "This is talent's id",
  })
  id: string;
}
