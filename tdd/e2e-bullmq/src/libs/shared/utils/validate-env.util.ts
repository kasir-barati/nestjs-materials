import type { ClassConstructor } from 'class-transformer';

import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { isNil } from './is-nil.util';

export function validateEnv<T extends object>(
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
    const errors = validatedConfigsErrors
      .map((error) => {
        if (isNil(error.constraints)) {
          return;
        }

        return {
          value: error.value as unknown,
          property: error.property,
          message: Object.values(error.constraints)[0],
        };
      })
      .filter(Boolean);

    Logger.debug({
      message:
        'Application could not load required environment variables',
      optionalParams: {
        errors,
      },
    });
    throw new Error(validatedConfigsErrors.toString());
  }

  return validatedConfigs;
}
