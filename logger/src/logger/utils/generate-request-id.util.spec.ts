import { Request, Response } from 'express';
import { SinonMock } from '../../utils/sinon-mock.util';
import { genReqId } from './generate-request-id.util';

describe('genReqId', () => {
  it.each([
    { id: 1 },
    { id: undefined, headers: { 'x-request-id': undefined } },
    { id: 'some-string' },
  ])(
    "should generate a new request id when req.id and req.headers['x-request-id'] are undefined or ain't UUID",
    (req) => {
      const mockSetHeader = jest.fn();

      const id = genReqId(
        SinonMock.with<Request>(req),
        SinonMock.with<Response>({ setHeader: mockSetHeader }),
      );

      expect(id).toBeDefined();
      expect(mockSetHeader).toHaveBeenCalledWith('x-request-id', id);
    },
  );

  it.each([
    {
      id: '3bcab410-cbba-4827-a522-379b862fbb03',
    },
    {
      headers: {
        'x-request-id': 'c2c2692a-1c16-4a8b-8b6c-00cb00de6427',
      },
    },
  ])('should return the existing UUID as the request id', (req) => {
    const id = genReqId(
      req as unknown as Request,
      SinonMock.with<Response>({}),
    );

    if (req.id) {
      expect(id).toBe(req.id);
    } else {
      expect(id).toBe(req.headers['x-request-id']);
    }
  });
});
