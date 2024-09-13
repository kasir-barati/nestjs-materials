import { Pagination, PaginationMixin } from '@app/common';
import {
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReadVerificationDto } from './dto/response.dto';
import { VerificationSanitizer } from './verification.sanitizer';
import { VerificationService } from './verification.service';

@ApiTags('Verification')
@Controller('verifications')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly verificationSanitizer: VerificationSanitizer,
  ) {}

  @ApiOperation({
    summary: 'Read all verifications.',
    description: 'Read all verifications.',
  })
  @ApiOkResponse({
    type: PaginationMixin(ReadVerificationDto),
    description: 'Returns the updated driver resource.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Server error.',
  })
  @Get()
  async read(): Promise<Pagination<ReadVerificationDto>> {
    const unsanitizedData = await this.verificationService.read();

    return this.verificationSanitizer.toRead(unsanitizedData);
  }
}
