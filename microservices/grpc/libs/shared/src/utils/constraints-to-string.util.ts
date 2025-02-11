import { ValidationError } from 'class-validator';

export function constraintsToString(
  validationError: ValidationError[],
) {
  return validationError.reduce((accumulator, currentError) => {
    accumulator += Object.values(currentError.constraints).join(', ');

    return accumulator;
  }, '');
}
