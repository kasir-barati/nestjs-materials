import {
  generateRandomString,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { Response } from 'express';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';

describe('AuthServiceController', () => {
  let controller: AuthServiceController;
  let authServiceService: SinonMockType<AuthServiceService>;
  let response: SinonMockType<Response>;

  beforeEach(() => {
    response = SinonMock.with<Response>({});
    authServiceService = SinonMock.of(AuthServiceService);
    controller = new AuthServiceController(authServiceService);
  });

  it('should login', async () => {
    const user = {
      _id: 'object id 1',
      email: generateRandomString() + '@three.tw',
    };
    await controller.login(user, response);

    expect(authServiceService.login.calledWith(user, response));
    expect(response.send.callCount).toBe(1);
  });
});
