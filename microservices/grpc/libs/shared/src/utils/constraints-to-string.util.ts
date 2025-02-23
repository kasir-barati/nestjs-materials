import { ValidationError } from 'class-validator';

/**@todo this function might causes performance issue, if that happened try to optimize this function*/
export function constraintsToString(
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
          matches.push(...(Object.values(object[key]) as string[]));
        } else {
          deepSearchByKey(object[key], originalKey, matches);
        }
      }
    }
  }

  return matches;
}
