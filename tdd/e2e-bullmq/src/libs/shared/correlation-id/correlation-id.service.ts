import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClsService } from 'nestjs-cls';
import { CORRELATION_ID_CLS_KEY } from './correlation-id.constant';

@Injectable()
export class CorrelationIdService {
  private readonly logger = new Logger(CorrelationIdService.name);

  constructor(private readonly clsService: ClsService) {}

  get correlationId(): string {
    return (
      this.clsService.get(CORRELATION_ID_CLS_KEY) ?? randomUUID()
    );
  }
}
