import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Request } from 'express';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import {
  CORRELATION_ID_CLS_KEY,
  CORRELATION_ID_HEADER_NAME,
} from './correlation-id.constant';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  private logger = new Logger(CorrelationIdInterceptor.name);

  constructor(private readonly clsService: ClsService) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    let correlationId: string;

    switch (executionContext.getType()) {
      case 'http': {
        const request: Request = executionContext.switchToHttp().getRequest();
        const correlationIdValue = Array.isArray(
          request.headers[CORRELATION_ID_HEADER_NAME]
        )
          ? request.headers[CORRELATION_ID_HEADER_NAME][0]
          : request.headers[CORRELATION_ID_HEADER_NAME];

        correlationId = correlationIdValue ?? randomUUID();

        break;
      }
      case 'rpc': {
        const { correlationId: correlationIdValue } = executionContext
          .switchToRpc()
          .getContext<{ correlationId?: string }>();

        correlationId = correlationIdValue ?? randomUUID();

        break;
      }
      default:
        throw 'Unimplemented request type';
    }

    this.clsService.set(CORRELATION_ID_CLS_KEY, correlationId);

    return next.handle();
  }
}
