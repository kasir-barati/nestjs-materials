import { Logger } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, validateSync } from 'class-validator';

export function validateEnvs<T extends object>(
  rawEnvs: Record<string, unknown>,
  ValidationClass: ClassConstructor<T>,
): T {
  const validatedConfigs = plainToInstance(ValidationClass, rawEnvs, {
    enableImplicitConversion: true,
  });
  const validatedConfigsErrors = validateSync(validatedConfigs, {
    skipMissingProperties: false,
  });

  if (validatedConfigsErrors.length > 0) {
    Logger.debug({
      message:
        'Application could not load required environment variables',
      optionalParams: {
        errors: validatedConfigsErrors.map((error) => ({
          value: error.value,
          property: error.property,
          message: Object.values(error?.constraints ?? {})[0],
        })),
      },
    });
    throw new Error(validatedConfigsErrors.toString());
  }

  return validatedConfigs;
}

export async function validateCursor<T extends object>(
  rawEnvs: Record<string, unknown>,
  ValidationClass: ClassConstructor<T>,
): Promise<T> {
  const validatedCursor = plainToInstance(ValidationClass, rawEnvs, {
    enableImplicitConversion: true,
  });
  const validatedConfigsErrors = await validate(validatedCursor, {
    skipMissingProperties: false,
  });

  if (validatedConfigsErrors.length > 0) {
    Logger.debug({
      message: 'Passed cursor is invalid',
      optionalParams: {
        errors: validatedConfigsErrors.map((error) => ({
          value: error.value,
          property: error.property,
          message: Object.values(error?.constraints ?? {})[0],
        })),
      },
    });
    throw new Error(validatedConfigsErrors.toString());
  }

  return validatedCursor;
}
