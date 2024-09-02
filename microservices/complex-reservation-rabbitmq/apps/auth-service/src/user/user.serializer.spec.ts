import { SinonMock } from '@app/testing';
import { User } from './entities/user.entity';
import { UserSerializer } from './user.serializer';

describe('UserSerializer', () => {
  let serializer: UserSerializer;

  beforeEach(() => {
    serializer = new UserSerializer();
  });

  it('should serialize me', () => {
    const unserializedData = SinonMock.with<User>({
      _id: 'object id',
      email: 'ema@mmail.cc',
      password: 'hashed pass',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const me = serializer.serializeMe(unserializedData);

    expect(me).toStrictEqual({
      _id: 'object id',
      email: 'ema@mmail.cc',
      createdAt: unserializedData.createdAt,
      updatedAt: unserializedData.updatedAt,
    });
  });
});
