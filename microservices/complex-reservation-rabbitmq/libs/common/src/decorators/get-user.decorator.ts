import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { AttachedUserToTheRequest } from '../types/attached-user-to-the-request.type';

export const GetUser = createParamDecorator(
  (
    _data: unknown,
    ctx: ExecutionContext,
  ): AttachedUserToTheRequest => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
