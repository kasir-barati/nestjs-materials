import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'outlier',
    description: "It serves as category's name",
  })
  @IsString()
  title: string;
}
