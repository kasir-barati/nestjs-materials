import { applyDecorators } from "@nestjs/common";
import { ValidateIf } from "class-validator";

/**
 * @description Do not annotate the fields with @IsOptional since it will not validate them at all.
 */
export function AnyOf(properties: string[]) {
  return function (target: any) {
    for (const property of properties) {
      const otherProps = properties.filter((prop) => prop !== property);
      const decorators = [
        ValidateIf((obj: Record<string, unknown>) => {
          const isCurrentPropDefined = obj[property] !== undefined;
          const areOtherPropsUndefined = otherProps.reduce(
            (acc, prop) => acc && obj[prop] === undefined,
            true
          );

          return isCurrentPropDefined || areOtherPropsUndefined;
        }),
      ];

      for (const decorator of decorators) {
        applyDecorators(decorator)(target.prototype, property);
      }
    }
  };
}
