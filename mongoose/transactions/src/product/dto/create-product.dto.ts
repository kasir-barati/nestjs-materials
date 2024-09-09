import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrUpdateProductDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Xiaomi redme',
    description: 'Product name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1000,
    description: 'How many of this product does exit?',
  })
  @IsOptional()
  @Min(0)
  @IsInt()
  quantity?: number;
}

export class CreatedOrUpdatedProductDto {
  @ApiProperty({
    type: String,
    description: 'Id of the created/updated product',
  })
  _id: string;

  @ApiProperty({
    type: String,
    description: 'Name of the created/updated product',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'Quantity of the created/updated product',
  })
  quantity: number;
}
