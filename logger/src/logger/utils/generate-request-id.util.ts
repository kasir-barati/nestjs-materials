import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

export function genReqId(req: Request, res: Response): string {
  const existingRequestId = req.id ?? req.headers['x-request-id'];

  if (existingRequestId && isUUID(existingRequestId)) {
    if (!res.getHeader('x-request-id')) {
      res.setHeader('x-request-id', existingRequestId as string);
    }

    return existingRequestId as string;
  }

  const id = randomUUID();

  res.setHeader('x-request-id', id);

  return id;
}
