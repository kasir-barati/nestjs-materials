import { SinonMock, SinonMockType } from '@app/common';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: SinonMockType<UserRepository>;

  beforeEach(async () => {
    repository = SinonMock.of(UserRepository);
    service = new UserService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
