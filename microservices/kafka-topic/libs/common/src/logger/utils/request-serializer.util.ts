import { Request } from 'express';
import { SerializedRequest } from '../logger.type';

export function serializeRequest(req: Request): SerializedRequest {
  return {
    id: req.id ?? req.headers['x-request-id'],
    url: req.url,
    body: req.body ?? req?.['raw']?.body,
    query: req.query,
    params: req.params,
    method: req.method,
    headers: req.headers,
    remotePort: req?.['remotePort'],
    remoteAddress: req?.['remoteAddress'],
  } as SerializedRequest;
}
