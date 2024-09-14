import { Response } from 'express';
import { SerializedResponse } from '../logger.type';

export function serializeResponse(res: Response): SerializedResponse {
  return {
    id: res?.['raw'].getHeader('x-request-id'),
    statusCode: res.statusCode,
  } as SerializedResponse;
}
