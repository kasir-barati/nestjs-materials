import { PaginationMixin } from '@app/common';
import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuditLogSerializer } from './audit-log.serializer';
import { ReadLogDto } from './dto/read-log.dto';
import { AuditLogService } from './services/audit-log.service';

@ApiTags('Log')
@Controller('logs')
export class AuditLogController {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly auditLogSerializer: AuditLogSerializer,
  ) {}

  @ApiOperation({
    summary: 'Read all log resources.',
  })
  @ApiOkResponse({
    type: PaginationMixin(ReadLogDto),
    description: 'Returns logs.',
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    description: 'Bad request.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @Get()
  async read() {
    const data = await this.auditLogService.read();

    return this.auditLogSerializer.toRead(data);
  }
}
