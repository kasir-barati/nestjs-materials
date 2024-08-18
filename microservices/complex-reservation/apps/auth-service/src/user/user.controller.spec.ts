import { SinonMock, SinonMockType } from '@app/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: SinonMockType<UserService>;

  beforeEach(async () => {
    service = SinonMock.of(UserService);
    controller = new UserController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
