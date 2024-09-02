import { SinonMock, SinonMockType } from '@app/testing';
import { UserController } from './user.controller';
import { UserSerializer } from './user.serializer';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: SinonMockType<UserService>;
  let serializer: SinonMockType<UserSerializer>;

  beforeEach(async () => {
    service = SinonMock.of(UserService);
    serializer = SinonMock.of(UserSerializer);
    controller = new UserController(service, serializer);
  });

  it('should create user', async () => {
    service.create.resolves('object id');

    const result = await controller.create({
      email: 'em@google.com',
      password: 'password',
    });

    expect(result).toBe('object id');
  });

  it('should propagates errors occurred while creating user in UserService', async () => {
    service.create.rejects(new Error());

    const result = controller.create({
      email: 'em@google.com',
      password: 'password',
    });

    await expect(result).rejects.toThrowError(new Error());
  });

  it('should return user info', async () => {
    service.findById.resolves();
    serializer.serializeMe.resolves();

    await controller.me({
      _id: 'object id',
      email: 'pope@fifa.cv',
    });

    expect(service.findById.calledWith('object id')).toBeTruthy();
    expect(serializer.serializeMe.callCount).toBe(1);
  });

  it('should propagates errors occurred in UserService.findById', async () => {
    service.findById.rejects(new Error());

    const result = controller.me({
      _id: 'object id',
      email: 'pope@fifa.cv',
    });

    await expect(result).rejects.toThrowError(new Error());
  });
});
