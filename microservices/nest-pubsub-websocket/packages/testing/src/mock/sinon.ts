// Source code: https://github.com/maxjoehnk/proxy-mocks
import { SinonStub, stub } from 'sinon';
import {
    MockPrototype,
    createMockImplementationWithStubFunction,
} from './mock';

import * as base from './mock';

/**
 * Mock object with generated stubs.
 *
 * There is no guarantee whether a property is actually a stub or not as it can be overridden at creation time.
 */
export type ISinonMock<TObject extends base.MockableObject> =
    base.IMock<TObject, SinonStub>;

export const SinonMock: MockPrototype<SinonStub> =
    createMockImplementationWithStubFunction(stub);
