import { ApiProperty } from '@nestjs/swagger';

export class FindOneCategoryResponseDto {
    @ApiProperty({
        example: '6ab97d0f-fac3-4c05-ad7d-0b6f33274a93',
        description: "Category's id",
    })
    id: string;

    @ApiProperty({
        example: 'tactful',
        description: "Category's title",
    })
    title: string;
}
