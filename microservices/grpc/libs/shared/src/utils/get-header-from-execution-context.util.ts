import { Metadata } from '@grpc/grpc-js';
import { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export function getHeaderFromExecutionContext(
  executionContext: ExecutionContext,
  headerName: string,
): string {
  if (executionContext.getType() === 'http') {
    const request: Request = executionContext
      .switchToHttp()
      .getRequest();
    const header = request.headers[headerName];

    return Array.isArray(header) ? header[0] : header;
  }

  if (executionContext.getType() === 'rpc') {
    const rpcArgumentsHost = executionContext.switchToRpc();

    return rpcArgumentsHost
      .getContext<Metadata>()
      .get(headerName)[0] as string;
  }
}
