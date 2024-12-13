import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GraphqlJwtAuthGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  override getRequest(context: ExecutionContext): Request {
    const graphqlExecutionContext =
      GqlExecutionContext.create(context);
    const request = graphqlExecutionContext.getContext<{
      req: Request;
    }>().req;

    return request;
  }
}
