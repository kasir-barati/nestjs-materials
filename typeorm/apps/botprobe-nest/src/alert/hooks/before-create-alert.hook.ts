import { Injectable } from '@nestjs/common';
import {
  BeforeCreateOneHook,
  CreateOneInputType,
} from '@ptc-org/nestjs-query-graphql';
import { GraphqlContext } from 'shared';

interface UserId {
  userId: string;
}

@Injectable()
export class BeforeCreateAlertHook<T extends UserId>
  implements BeforeCreateOneHook<T, GraphqlContext>
{
  run(
    instance: CreateOneInputType<T>,
    context: GraphqlContext,
  ): CreateOneInputType<T> | Promise<CreateOneInputType<T>> {
    instance.input.userId = context.req.user;

    return instance;
  }
}
