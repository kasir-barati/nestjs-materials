import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ExecutionContextToResponsePipe } from '../pipes/execution-context-to-response.pipe';
import { Response } from '../utils/response.util';

/**@description createParamDecorator utility builds a bridge between pipe and getting execution context. */
const GetExecutionContext = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => ctx,
);

/**
 * @description Utilizes execution context to retrieve the current response object and then through HttpAdaptor it changes the response's status code and or header.
 **/
export const GetResponse = () =>
  GetExecutionContext(ExecutionContextToResponsePipe);

export type ResponseType = Response;
