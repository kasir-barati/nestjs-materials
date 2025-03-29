import { Queue } from 'bull';
import Sinon from 'sinon';

import { CorrelationIdService } from '../libs/shared';
import { SinonMock, SinonMockType } from '../libs/testing';
import { AppService } from './app.service';
import { Message } from './types/jobs.type';

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
