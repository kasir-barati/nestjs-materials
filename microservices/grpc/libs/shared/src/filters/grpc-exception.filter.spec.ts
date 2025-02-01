import { ArgumentsHost, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { GrpcExceptionFilter } from './grpc-exception.filter';

describe('GrpcExceptionFilter', () => {
  let filter: GrpcExceptionFilter;

  beforeEach(() => {
    jest.spyOn(Logger, 'error');
    filter = new GrpcExceptionFilter();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log the exception', () => {
    const exception = new RpcException('test error');
    const hostMock = {} as ArgumentsHost;

    filter.catch(exception, hostMock);

    expect(Logger.error).toHaveBeenCalledWith(exception, 'GrpcExceptionFilter');
  });

  it('should return an Observable that emits the exception error', (done) => {
    const errorMessage = 'test error';
    const exception = new RpcException(errorMessage);
    const hostMock = {} as ArgumentsHost;

    const result$: Observable<string | object> = filter.catch(
      exception,
      hostMock
    );

    result$.subscribe({
      error: (err) => {
        expect(err).toBe(errorMessage);
        done();
      },
    });
  });
});
