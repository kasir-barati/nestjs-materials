import { ApiProperty } from '@nestjs/swagger';
import { IsIBAN, IsOptional, IsString } from 'class-validator';

export class BankingInformationDto {
  @ApiProperty({
    type: String,
    required: false,
    example: 'Attijariwafa Bank',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'TMBQBHDG',
    description: "The last three characters won't be included.",
  })
  @IsString()
  @IsOptional()
  bic: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'MA49179349523164295672421449',
  })
  @IsIBAN()
  @IsOptional()
  iban: string;
}
