import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ContactInformationDto {
  @ApiProperty({
    type: String,
    required: false,
    example: '+13866212019',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'ex@te.eg',
  })
  @IsString()
  @IsOptional()
  email?: string;
}
