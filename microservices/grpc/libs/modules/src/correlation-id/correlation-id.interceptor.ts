import { getHeaderFromExecutionContext } from '@grpc/shared';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import {
  CORRELATION_ID_CLS_KEY,
  CORRELATION_ID_HEADER_NAME,
} from './correlation-id.constant';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  private logger = new Logger(CorrelationIdInterceptor.name);

  constructor(private readonly clsStoreClsService: ClsService) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const correlationId: string =
      getHeaderFromExecutionContext(
        executionContext,
        CORRELATION_ID_HEADER_NAME,
      ) ?? randomUUID();

    this.clsStoreClsService.set(
      CORRELATION_ID_CLS_KEY,
      correlationId,
    );
    return next.handle();
  }
}
