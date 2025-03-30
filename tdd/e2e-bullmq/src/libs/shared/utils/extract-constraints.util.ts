/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { ValidationError } from 'class-validator';

export function extractConstraints(
  errors: ValidationError[],
): string[] {
  const constraints: string[] = [];

  for (const error of errors) {
    const errorMessages = deepSearchByKey(error, 'constraints');
    constraints.push(...errorMessages);
  }

  return constraints;
}

function deepSearchByKey(
  object: any,
  originalKey: string,
  matches: string[] = [],
) {
  if (object != null) {
    if (Array.isArray(object)) {
      for (const arrayItem of object) {
        deepSearchByKey(arrayItem, originalKey, matches);
      }
    } else if (typeof object == 'object') {
      for (const key of Object.keys(object)) {
        if (key == originalKey) {
          matches.push(
            ...Object.values(object[key] as Record<string, any>),
          );
        } else {
          deepSearchByKey(object[key], originalKey, matches);
        }
      }
    }
  }

  return matches;
}
