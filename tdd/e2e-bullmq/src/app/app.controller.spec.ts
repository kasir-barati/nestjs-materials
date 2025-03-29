import Sinon from 'sinon';

import { SinonMock, SinonMockType } from '../libs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: SinonMockType<AppService>;

  beforeEach(() => {
    service = SinonMock.of(AppService);

    controller = new AppController(service);
  });

  it('should return the result of service call', async () => {
    service.getHello = Sinon.mock().resolves(`whatever`);

    const res = await controller.getHello();

    expect(res).toBe('whatever');
  });
});
