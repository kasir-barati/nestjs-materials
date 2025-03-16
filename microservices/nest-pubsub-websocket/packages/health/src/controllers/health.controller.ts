import { Controller, Get } from '@nestjs/common';
import {
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { HealthModel } from '../contracts/health-model.contract';

/**
 * Controller to check if application is healthy (live).
 */
@Controller('health')
@ApiTags('Health')
export class HealthController {
    /**
     * Return whether the application is healthy (live).
     *
     * @returns Whether the health check was successful.
     */
    @Get()
    @ApiOperation({ summary: 'Read health status of API' })
    @ApiOkResponse({
        type: HealthModel,
        description: 'Health status',
    })
    readHealth(): HealthModel {
        return { success: true };
    }
}
