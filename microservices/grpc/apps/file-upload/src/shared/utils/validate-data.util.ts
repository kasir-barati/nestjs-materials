import { constraintsToString } from '@grpc/shared';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { Class } from '../interfaces';

export async function validateData<Dto>(
  unvalidatedData: Dto,
  Dto: Class<Dto>,
): Promise<Dto> {
  const data = plainToInstance(Dto, unvalidatedData, {
    enableImplicitConversion: true,
  });
  const validationResult = await validate(data as object);

  if (validationResult.length > 0) {
    const error = constraintsToString(validationResult);
    throw error?.join(', ') ?? 'Validation failed';
  }

  return data;
}
