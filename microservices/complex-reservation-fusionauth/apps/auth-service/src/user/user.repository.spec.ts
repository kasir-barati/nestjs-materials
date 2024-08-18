import { SinonMock, SinonMockType } from '@app/common';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;
  let model: SinonMockType<Model<User>>;

  beforeEach(() => {
    model = SinonMock.of(Model<User>);
    repository = new UserRepository(model);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
