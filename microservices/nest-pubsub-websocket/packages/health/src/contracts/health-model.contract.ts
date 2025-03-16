import { ApiProperty } from '@nestjs/swagger';

export class HealthModel {
    @ApiProperty({
        type: Boolean,
        description: 'Health status',
        example: true,
    })
    success: boolean;
}
