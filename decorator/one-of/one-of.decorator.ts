import { applyDecorators } from "@nestjs/common";
import {
  registerDecorator,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

/**
 * @description
 * Throws an error if more than one of the properties are present in the request body/querystring.
 */
export function OneOf(properties: string[]) {
  return function (target: any) {
    for (const property of properties) {
      const otherProps = properties.filter((prop) => prop !== property);

      applyDecorators(
        ValidateIf((obj: Record<string, unknown>) => {
          const areOtherPropsUndefined = otherProps.reduce(
            (acc, prop) => acc && obj[prop] === undefined,
            true
          );
          const isCurrentPropDefined = obj[property] !== undefined;

          return isCurrentPropDefined || areOtherPropsUndefined;
        }),
        OneOfChecker(properties)
      )(target.prototype, property);
    }
  };
}

function OneOfChecker(properties: string[]): PropertyDecorator {
  return function (object: Object, propertyName: string | symbol): void {
    registerDecorator({
      name: "OneOfChecker",
      constraints: [properties],
      target: object.constructor,
      propertyName: String(propertyName),
      validator: OneOfCheckerConstraint,
    });
  };
}

@ValidatorConstraint({ name: "OneOfChecker" })
class OneOfCheckerConstraint implements ValidatorConstraintInterface {
  validate(
    value: unknown,
    validationArguments: ValidationArguments
  ): boolean | Promise<boolean> {
    let [properties] = validationArguments.constraints as [string[]];
    properties = properties.filter(
      (property) => property !== validationArguments.property
    );
    const data = validationArguments.object as Record<string, unknown>;

    for (const property of properties) {
      const propertyValue = data[property];

      if (!isNil(value) && !isNil(propertyValue)) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const [properties] = validationArguments.constraints as [string[]];
    const props = properties.reduce((accumulator, current, index) => {
      if (index === properties.length - 2) {
        accumulator += current + ", and ";
      } else if (index === properties.length - 1) {
        accumulator += current;
      } else {
        accumulator += current + ", ";
      }

      return accumulator;
    }, "");

    return `Do not send ${props} at the same time!`;
  }
}

function isNil(value: unknown) {
  return value === null || value === undefined;
}
