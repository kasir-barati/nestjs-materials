import { SerializedResponse, UnserializedResponse } from '../logger.type';

export function serializeResponse(
  res: UnserializedResponse,
): SerializedResponse {
  return {
    requestId: res?.raw?.getHeader('x-request-id'),
    statusCode: res.statusCode,
  } as SerializedResponse;
}
