import {
  DuplicationError,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { BadRequestException } from '@nestjs/common';
import { hash } from 'argon2';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

jest.mock('argon2');

describe('UserService', () => {
  let service: UserService;
  let repository: SinonMockType<UserRepository>;

  beforeEach(async () => {
    repository = SinonMock.of(UserRepository);
    service = new UserService(repository);
  });

  it('should create user and hash their password', async () => {
    repository.create.resolves({ _id: '66c1e967f5108911fc80712a' });

    const userId = await service.create({
      email: 'some@hhh.ooo',
      password: '12ttRR22@@',
    });

    expect(userId).toBe('66c1e967f5108911fc80712a');
    expect(hash).toHaveBeenCalledTimes(1);
    expect(hash).toHaveBeenCalledWith('12ttRR22@@');
  });

  it('should throw bad request exception on duplicate email', async () => {
    repository.create.rejects(
      new DuplicationError('email', 'email already exists.'),
    );

    const result = service.create({
      email: 'some@hhh.ooo',
      password: '12ttRR22@@',
    });

    expect(result).rejects.toThrowError(
      new BadRequestException('email already exists.'),
    );
  });

  it.each<string>(['feast@gluttony.co', 'fun@circus.jp'])(
    'should find user by email',
    async (email) => {
      repository.findByEmail.withArgs(email).resolves({
        _id: '66c1e967f5108911fc80712a',
        email,
      });

      const user = await service.findByEmail(email);

      expect(user).toStrictEqual({
        _id: '66c1e967f5108911fc80712a',
        email,
      });
    },
  );

  it('should propagates errors occurred in the repository findByEmail', async () => {
    const email = 'juggernaut@xxx.cp';
    repository.findByEmail.withArgs(email).rejects(new Error());

    const result = service.findByEmail(email);

    await expect(result).rejects.toThrowError(new Error());
  });

  it('should find user by id', async () => {
    const id = 'object id';
    repository.findById.withArgs(id).resolves({ _id: id });

    const result = await service.findById(id);

    expect(result).toStrictEqual({ _id: id });
  });

  it('should propagates errors occurred in findById', async () => {
    repository.findById.rejects(new Error());

    const result = service.findById('object id');

    await expect(result).rejects.toThrowError(new Error());
  });
});
