import { ExecutionContext, Injectable, PipeTransform } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from '../utils/response.util';

@Injectable()
export class ExecutionContextToResponsePipe implements PipeTransform {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**@description Uses HttpAdapterHost to access high-level operations that are implemented by the HTTP adapter. */
  transform(ctx: ExecutionContext): Response {
    return new Response(this.httpAdapterHost.httpAdapter, ctx);
  }
}
