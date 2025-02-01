import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { CurrentUser } from '../types/auth.type';

// TODO: Integrate and implement a FusionAuth

export const GetCurrentUser = createParamDecorator(
  (_data: unknown, _ctx: ExecutionContext): CurrentUser => {
    // const request = ctx.switchToHttp().getRequest();
    // return request.user;

    return {
      sub: '40c3363c-5fc7-400b-8752-5854c44f7491',
      email: 'some@mail.ai',
    };
  }
);
