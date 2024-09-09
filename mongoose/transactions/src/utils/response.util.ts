import type {
  ExecutionContext,
  HttpArgumentsHost,
} from '@nestjs/common/interfaces';
import { AbstractHttpAdapter } from '@nestjs/core';

// Note that this isn't a provider
export class Response {
  httpCtx: HttpArgumentsHost;

  constructor(
    private readonly httpAdapter: AbstractHttpAdapter,
    readonly executionContext: ExecutionContext,
  ) {
    this.httpCtx = executionContext.switchToHttp();
  }

  /**@description Define the HTTP header on the supplied response object. */
  setHeader(name: string, value: string): this {
    const response = this.httpCtx.getResponse();

    this.httpAdapter.setHeader(response, name, value);

    return this;
  }

  /**@description Define the HTTP status code on the supplied response object. */
  setStatus(statusCode: number): this {
    const response = this.httpCtx.getResponse();

    this.httpAdapter.status(response, statusCode);

    return this;
  }
}
