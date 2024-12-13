import { SinonStub } from 'sinon';

export type MockableEntity = object;

// eslint-disable-next-line @typescript-eslint/ban-types
export interface MockableConstructor<T> extends Function {
  new (...args: any): T;
}

export type RecursivePartial<T> = Partial<{
  [key in keyof T]: T[key] extends (...a: Array<infer U>) => unknown
    ? (
        ...a: Array<U>
      ) => RecursivePartial<ReturnType<T[key]>> | ReturnType<T[key]> // tslint:disable-line
    : T[key] extends Array<unknown>
      ? Array<RecursivePartial<T[key][number]>>
      : RecursivePartial<T[key]> | T[key];
}>;

export type StubbedObject<
  TObject extends MockableEntity,
  TStub,
> = TObject & {
  [P in keyof TObject]: TStub;
};

export type MockedEntityWithSinonStubs<
  TObject extends MockableEntity,
> = StubbedObject<TObject, SinonStub>;

export interface MockGenerator<TStub> {
  /**
   * Generate a new mock for the given class.
   *
   * @param mockableConstructor the class to generate a mock for.
   * @param overrides can be used to set properties. They will not be replaced with stubs.
   */
  of<TObject extends MockableEntity>(
    mockableConstructor: MockableConstructor<TObject>,
    overrides?: RecursivePartial<TObject>,
  ): StubbedObject<TObject, TStub>;

  /**
   * Generate new mock without setting the prototype (for e.g. a Typescript interface)
   *
   * {@param overrides} can be used to set properties. They will not be replaced with stubs.
   */
  with<TObject extends MockableEntity>(
    overrides: RecursivePartial<TObject>,
  ): StubbedObject<TObject, TStub>;
}
