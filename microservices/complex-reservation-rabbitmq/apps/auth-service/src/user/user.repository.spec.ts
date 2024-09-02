import { SinonMock, SinonMockType } from '@app/testing';
import { NotFoundException } from '@nestjs/common';
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

  it.each<string>(['sam@lol.pp', 'kim@jungle.com'])(
    'should find user by email: %s',
    async (email) => {
      model.findOne.resolves({
        toObject() {
          return { _id: 'object id', email };
        },
      });

      const user = await repository.findByEmail(email);

      expect(user).toStrictEqual({ _id: 'object id', email });
    },
  );

  it('should throw error on non-existing emails', async () => {
    model.findOne.resolves();

    const result = repository.findByEmail('email@ff.cc');

    expect(result).rejects.toThrowError(
      new NotFoundException('Could not find user with email@ff.cc'),
    );
  });
});
