import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

export function genReqId(req: Request, res: Response): string {
  const existingID = req.id ?? req.headers['x-request-id'];

  if (existingID && isUUID(existingID)) {
    return existingID.toString();
  }

  const id = randomUUID();

  res.setHeader('x-request-id', id);

  return id;
}
