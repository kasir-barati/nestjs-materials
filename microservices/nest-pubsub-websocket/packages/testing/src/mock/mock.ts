// Source code: https://github.com/maxjoehnk/proxy-mocks
export type RecursivePartial<T> = Partial<{
    [key in keyof T]: T[key] extends (...a: Array<infer U>) => unknown
        ? (
              ...a: Array<U>
          ) =>
              | RecursivePartial<ReturnType<T[key]>>
              | ReturnType<T[key]> // tslint:disable-line
        : T[key] extends Array<unknown>
        ? Array<RecursivePartial<T[key][number]>>
        : RecursivePartial<T[key]> | T[key];
}>;

/**
 * Mock object with generated stubs.
 *
 * There is no guarantee whether a property is actually a stub or not as it can be overridden at creation time.
 */
export type IMock<TObject extends MockableObject, TStub> = TObject & {
    [P in keyof TObject]: TStub;
};

/**
 * Generate new mock class using given {@param stubFunction} to generate stubs
 */
export function createMockImplementationWithStubFunction<TStub>(
    stubFunction: () => TStub,
): MockPrototype<TStub> {
    return class Mock {
        /**
         * Generate a new mock for the given class.
         *
         * @param mockGeneratorClass the class to generate a mock for.
         * @param overrides can be used to set properties. They will not be replaced with stubs.
         */
        public static of<TObject extends MockableObject>(
            mockGeneratorClass: MockGeneratorClass<TObject> | null = null,
            overrides: RecursivePartial<TObject> = {},
        ): IMock<TObject, TStub> {
            return new Proxy<IMock<TObject, TStub>>(
                overrides as any,
                {
                    get(
                        target: IMock<TObject, TStub>,
                        key: PropertyKey,
                    ) {
                        // Angular tries to create a Set of a provided value via the following code
                        //
                        // ```javascript
                        // var QUOTED_KEYS = '$quoted$';
                        // var quotedSet = new Set(map && map[QUOTED_KEYS]);
                        // ```
                        //
                        // This fails when $quoted$ is a stub, so we explicitly return undefined here
                        if (key === '$quoted$') {
                            return undefined;
                        }

                        if (key === 'then') {
                            return undefined;
                        }
                        const name: keyof TObject = key as any;
                        if (target[name] === undefined) {
                            target[name] = stubFunction() as any;
                        }
                        return target[name];
                    },
                    getPrototypeOf(): MockableObject | null {
                        return mockGeneratorClass?.prototype ?? null;
                    },
                },
            );
        }

        /**
         * Generate new mock without setting the prototype (for e.g. a Typescript interface)
         *
         * {@param overrides} can be used to set properties. They will not be replaced with stubs.
         */
        public static with<TObject extends MockableObject>(
            overrides: RecursivePartial<TObject> = {},
        ): IMock<TObject, TStub> {
            return Mock.of<TObject>(null, overrides);
        }
    };
}

interface MockGeneratorClass<T> extends Function {
    new (...args: any[]): T;
}

export interface MockPrototype<TStub> {
    /**
     * Generate a new mock for the given class.
     *
     * @param mockGeneratorClass the class to generate a mock for.
     * @param overrides can be used to set properties. They will not be replaced with stubs.
     */
    of<TObject extends MockableObject>(
        mockGeneratorClass: MockGeneratorClass<TObject>,
        overrides?: RecursivePartial<TObject>,
    ): IMock<TObject, TStub>;

    /**
     * Generate new mock without setting the prototype (for e.g. a Typescript interface)
     *
     * {@param overrides} can be used to set properties. They will not be replaced with stubs.
     */
    with<TObject extends MockableObject>(
        overrides: RecursivePartial<TObject>,
    ): IMock<TObject, TStub>;
}

export type MockableObject = object;
