import { isUUID } from 'class-validator';
import { CorrelationIdService } from './correlation-id.service';

/**
 * @description
 * This decorator **assumes** that the first argument of the method is the correlation id & that the class has a `correlationIdService` property.
 */
export function UseCorrelationId() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const correlationId = args[0] as string;
      const typedThis = this as {
        correlationIdService: CorrelationIdService;
      };

      if (!isUUID(correlationId)) {
        throw 'First parameter should be correlation ID';
      }

      return typedThis.correlationIdService.useCorrelationId(
        correlationId,
        () => originalMethod.apply(this, args),
      );
    };

    return descriptor;
  };
}
