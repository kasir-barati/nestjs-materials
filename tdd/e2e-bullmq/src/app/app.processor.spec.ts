import { randomUUID } from 'crypto';
import { ClsService } from 'nestjs-cls';

import { SinonMock } from '../libs/testing';
import { AppProcessor } from './app.processor';

describe('AppProcessor', () => {
  let processor: AppProcessor;

  beforeEach(() => {
    const clsService = SinonMock.of(ClsService);

    processor = new AppProcessor(clsService);
  });

  it('should process the job', async () => {
    const res = await processor.process({
      data: { message: 'Hello World' },
    } as any);

    expect(res).toBeUndefined();
  });

  it('should log the failed jobs', async () => {
    const spy = jest.spyOn(processor['logger'], 'error');

    await processor.failedEventHandler(
      {
        data: { message: 'some-msg', correlationId: randomUUID() },
      } as any,
      new Error('Some error'),
    );

    expect(spy).toHaveBeenCalled();
  });
});
