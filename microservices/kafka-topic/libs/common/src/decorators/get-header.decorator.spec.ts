import {
  getParamDecoratorFactory,
  SinonMock,
  SinonMockType,
} from '@app/testing';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { GetHeader } from './get-header.decorator';

describe('GetHeader Decorator', () => {
  let mockExecutionContext: SinonMockType<ExecutionContext>;
  let mockRequest: SinonMockType<Request>;

  beforeEach(() => {
    mockRequest = SinonMock.with<Request>({
      headers: {
        'authorization': 'Bearer some-token',
        'custom-header': 'custom-value',
      },
    });
    mockExecutionContext = SinonMock.with<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });
  });

  it('should return a specific header if data is provided', () => {
    const factory = getParamDecoratorFactory(GetHeader);

    const result = factory('authorization', mockExecutionContext);

    expect(result).toBe('Bearer some-token');
  });

  it('should return all headers if no data is provided', () => {
    const factory = getParamDecoratorFactory(GetHeader);

    const result = factory(null, mockExecutionContext);

    expect(result).toEqual({
      'authorization': 'Bearer some-token',
      'custom-header': 'custom-value',
    });
  });

  it('should return undefined if the requested header does not exist', () => {
    const factory = getParamDecoratorFactory(GetHeader);

    const result = factory(
      'non-existent-header',
      mockExecutionContext,
    );

    expect(result).toBeUndefined();
  });
});
