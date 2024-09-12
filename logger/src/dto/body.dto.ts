import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BodyDto {
  @ApiProperty({
    type: Number,
    example: 12345,
    description: 'Some field.',
  })
  @IsOptional()
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
