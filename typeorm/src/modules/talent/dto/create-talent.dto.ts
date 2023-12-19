import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class CreateTalentDto {
    @IsBoolean()
    @ApiProperty({
        example: false,
        description: 'Is user active or not?',
    })
    isActive: boolean;

    @IsBoolean()
    @ApiProperty({
        example: false,
        description:
            'Is user adaptable to new environments/situations or not?',
    })
    isAdaptable: boolean;

    @IsUUID('4', { each: true })
    @ApiProperty({
        required: false,
        example: ['9c0eedbb-e0c8-4f62-bfd2-f6b052f120f2'],
        description:
            'Categories that this talent is part of it or wanted to be',
    })
    categoriesIds?: string[];
}
