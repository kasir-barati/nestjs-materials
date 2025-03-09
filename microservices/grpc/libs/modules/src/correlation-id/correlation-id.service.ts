import { Metadata } from '@grpc/grpc-js';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { ClsService } from 'nestjs-cls';
import {
  CORRELATION_ID_CLS_KEY,
  CORRELATION_ID_HEADER_NAME,
} from './correlation-id.constant';

@Injectable()
export class CorrelationIdService {
  private readonly logger = new Logger(CorrelationIdService.name);

  constructor(private readonly clsStoreClsService: ClsService) {}

  correlationId(): string | undefined {
    return this.clsStoreClsService.get(CORRELATION_ID_CLS_KEY);
  }

  getCorrelationIdOrGenerate(): string {
    const correlationId = this.correlationId() ?? randomUUID();

    return correlationId;
  }

  addToHttpHeader(header: IncomingHttpHeaders) {
    header[CORRELATION_ID_HEADER_NAME] =
      this.getCorrelationIdOrGenerate();
  }

  addToGrpcMetaData(metadata: Metadata) {
    const correlationId = this.getCorrelationIdOrGenerate();

    metadata.add(CORRELATION_ID_HEADER_NAME, correlationId);
  }

  useCorrelationId<T>(correlationId: string, cb: () => T): T {
    return this.clsStoreClsService.run(() => {
      this.clsStoreClsService.set(
        CORRELATION_ID_CLS_KEY,
        correlationId,
      );
      return cb();
    });
  }
}
