import { flatten } from 'safe-flat';

export function containsNull<T extends object>(
  obj: T,
): {
  field?: string;
  result: boolean;
} {
  const flattenedObject = flatten(obj, '.');

  for (const key in flattenedObject) {
    const value = flattenedObject[key];

    if (value === null) {
      return {
        result: true,
        field: key,
      };
    }
  }

  return {
    result: false,
  };
}
