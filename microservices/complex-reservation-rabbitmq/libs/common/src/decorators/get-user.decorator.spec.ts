import { SinonMock, SinonMockType } from '@app/testing';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { getParamDecoratorFactory } from '../utils/get-param-decorator-factory.util';
import { GetUser } from './get-user.decorator';

describe('GetUser Decorator', () => {
  let mockExecutionContext: SinonMockType<ExecutionContext>;
  let mockRequest: SinonMockType<Request>;

  beforeEach(() => {
    mockRequest = SinonMock.with<Request>({
      user: {
        _id: 'object id',
        email: 'em@mail.com',
        password: 'hashed pass',
      },
    });
    mockExecutionContext = SinonMock.with<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    });
  });

  it('should return a specific header if data is provided', () => {
    const factory = getParamDecoratorFactory(GetUser);

    const result = factory(null, mockExecutionContext);

    expect(result).toStrictEqual({
      _id: 'object id',
      email: 'em@mail.com',
      password: 'hashed pass',
    });
  });
});
