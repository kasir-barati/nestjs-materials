import { SinonStub, stub } from 'sinon';
import {
  MockGenerator,
  MockableConstructor,
  MockableEntity,
  RecursivePartial,
  StubbedObject,
} from '../types/mock.type';

export type SinonMockType<TObject extends MockableEntity> =
  StubbedObject<TObject, SinonStub>;

export const SinonMock: MockGenerator<SinonStub> =
  createMockImplementationWithStubFunction(stub);

function createMockImplementationWithStubFunction<TStub>(
  stubFunction: () => TStub,
): MockGenerator<TStub> {
  return class Mock {
    /**
     * Generate a new mock for the given class.
     *
     * @param mockableConstructor the class to generate a mock for.
     * @param overrides can be used to set properties. They will not be replaced with stubs.
     */
    public static of<TEntity extends MockableEntity>(
      mockableConstructor: MockableConstructor<TEntity> | null = null,
      overrides: RecursivePartial<TEntity> = {},
    ): StubbedObject<TEntity, TStub> {
      return new Proxy<StubbedObject<TEntity, TStub>>(
        overrides as StubbedObject<TEntity, TStub>,
        {
          get(
            target: StubbedObject<TEntity, TStub>,
            key: PropertyKey,
          ) {
            if (key === '$quoted$') {
              return undefined;
            }

            if (key === 'then') {
              return undefined;
            }
            const name: keyof TEntity = key as keyof TEntity;
            if (target[name] === undefined) {
              target[name] = stubFunction() as StubbedObject<
                TEntity,
                TStub
              >[keyof TEntity];
            }
            return target[name];
          },
          getPrototypeOf(): MockableEntity | null {
            return mockableConstructor?.prototype ?? null;
          },
        },
      );
    }

    /**
     * Generate new mock without setting the prototype (for e.g. a Typescript interface)
     *
     * {@param overrides} can be used to set properties. They will not be replaced with stubs.
     */
    public static with<TObject extends MockableEntity>(
      overrides: RecursivePartial<TObject> = {},
    ): StubbedObject<TObject, TStub> {
      return Mock.of<TObject>(null, overrides);
    }
  };
}
