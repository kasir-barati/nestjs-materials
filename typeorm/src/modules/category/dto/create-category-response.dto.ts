import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryResponseDto {
    @ApiProperty({
        example: 'b3a37d32-2593-4f52-b873-bbb89c4b493c',
        description: "This is category's id",
    })
    id: string;
}
