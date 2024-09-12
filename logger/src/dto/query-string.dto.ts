import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryStringDto {
  @ApiProperty({
    type: Number,
    example: 12345,
    description: 'Some field.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  f1?: number;

  @ApiProperty({
    type: String,
    example: 'Something',
    description: 'Some field.',
  })
  @IsOptional()
  @IsString()
  f2?: string;
}
