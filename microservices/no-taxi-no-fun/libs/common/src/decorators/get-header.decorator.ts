import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetHeader = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.headers[data];
    }
    return req.headers;
  },
);
