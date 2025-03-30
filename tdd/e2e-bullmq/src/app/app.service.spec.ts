import type { Queue } from 'bull';

import Sinon from 'sinon';

import type { SinonMockType } from '../libs/testing';
import type { Message } from './types/jobs.type';

import { CorrelationIdService } from '../libs/shared';
import { SinonMock } from '../libs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let appQueue: SinonMockType<Queue<Message>>;

  beforeEach(() => {
    appQueue = SinonMock.with<Queue<Message>>({});
    const correlationIdService = SinonMock.of(CorrelationIdService);

    service = new AppService(appQueue, correlationIdService);
  });

  it('should return "Hello World!"', async () => {
    appQueue.add = Sinon.mock().resolves();

    const res = await service.getHello();

    expect(res).toEqual('Hello World!');
  });
});
