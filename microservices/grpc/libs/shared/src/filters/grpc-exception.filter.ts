import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(
    exception: RpcException,
    _host: ArgumentsHost
  ): Observable<string | object> {
    Logger.error(exception, GrpcExceptionFilter.name);

    return throwError(() => exception.getError());
  }
}
