import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

/**
 * @description
 * A utility function to extract the factory function of the parameter decorator, which we can then use it to manually invoke the decorator with mocked parameters. This enables us to test our custom decorators without the need to rely on NestJS framework. You can then use this factory function to manually invoke the decorator with mocked parameters for testing.
 */
export function getParamDecoratorFactory(
  // eslint-disable-next-line @typescript-eslint/ban-types
  Decorator: Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {
  // A dummy class Test the provided decorator by annotating a parameter with it.
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public test(@Decorator() _value: unknown) {}
  }

  // In TS/JS, you can use decorators to add metadata to classes, methods, properties, or parameters. This metadata can be retrieved at runtime using the `Reflect.getMetadata` function. This metadata contains information about the parameters of the decorated method.
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');

  // Extracting the factory function from the metadata and returning it.
  return args[Object.keys(args)[0]].factory;
}
