import { randomUUID } from 'crypto';
import { Response } from 'express';
import { SinonMock } from '../../utils/sinon-mock.util';
import { UnserializedResponse } from '../logger.type';
import { serializeResponse } from './response-serializer.util';

describe('serializeResponse', () => {
  let getHeaderMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each<UnserializedResponse>([
    {
      statusCode: 200,
      raw: SinonMock.with<Response>({
        getHeader: getHeaderMock,
      }),
    },
    {
      statusCode: 304,
      raw: SinonMock.with<Response>({
        getHeader: getHeaderMock,
      }),
    },
  ])('should serialize response', (unserializedResponse) => {
    const requestId = randomUUID();
    getHeaderMock.mockReturnValue(requestId);

    const result = serializeResponse(unserializedResponse);

    expect(result.requestId).toBe(requestId);
    expect(result.statusCode).toBe(unserializedResponse.statusCode);
  });
});
