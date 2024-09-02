import { generateRandomString } from '@app/common';
import { SinonMock, SinonMockType } from '@app/testing';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import * as Sinon from 'sinon';
import { AuthServiceService } from './auth-service.service';
import authServiceConfig from './configs/auth-service.config';
import { UserService } from './user/user.service';

jest.mock('argon2');

describe('AuthServiceService', () => {
  let service: AuthServiceService;
  let userService: SinonMockType<UserService>;
  let authServiceConfigs: SinonMockType<
    ConfigType<typeof authServiceConfig>
  >;
  let jwtService: SinonMockType<JwtService>;
  let response: SinonMockType<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = SinonMock.of(UserService);
    authServiceConfigs = SinonMock.with<
      ConfigType<typeof authServiceConfig>
    >({
      JWT_EXPIRATION: '16s',
    });
    jwtService = SinonMock.of(JwtService);
    service = new AuthServiceService(
      userService,
      authServiceConfigs,
      jwtService,
    );
    response = SinonMock.with<Response>({});
  });

  it.each<[string, string]>([
    ['email@emal.com', '12ASas##'],
    ['another@bother.co', 'coPL%%11'],
  ])(
    'should return user object on login with correct email & password',
    async (email, password) => {
      userService.findByEmail.withArgs(email).resolves({
        _id: 'object id',
        email,
        password: 'hashed password',
      });
      (verify as jest.Mock).mockResolvedValue(true);

      const user = await service.validateLogin(email, password);

      expect(verify).toHaveBeenCalledTimes(1);
      expect(verify).toHaveBeenCalledWith(
        'hashed password',
        password,
      );
      expect(user).toBeDefined();
    },
  );

  it.each<string>(['pass1', 'pass2'])(
    'should throw UnauthorizedException on incorrect password: %s',
    async (password) => {
      const email = 'ufu@hub.ru';
      userService.findByEmail.resolves({
        _id: 'object id',
        email,
        password: 'hashed password',
      });
      (verify as jest.Mock).mockResolvedValue(false);

      const result = service.validateLogin(email, password);

      await expect(result).rejects.toThrowError(
        new UnauthorizedException(
          'Username or password is not valid',
        ),
      );
      expect(verify).toHaveBeenCalledTimes(1);
      expect(verify).toHaveBeenCalledWith(
        'hashed password',
        password,
      );
    },
  );

  it.each<string>(['bob@hoo.foo', 'max@lilo.hr'])(
    'should throw UnauthorizedException on incorrect email: %s',
    async (email) => {
      userService.findByEmail.rejects(new NotFoundException());

      const result = service.validateLogin(email, 'password');

      await expect(result).rejects.toThrowError(
        new UnauthorizedException(
          'Username or password is not valid',
        ),
      );
    },
  );

  it('should attach Authentication cookie to the response', async () => {
    jwtService.signAsync.resolves('encrypted-jwt-token');

    await service.login(
      {
        _id: 'object id',
        email: generateRandomString() + 'kick.cc',
      },
      response,
    );

    expect(jwtService.signAsync.callCount).toBe(1);
    expect(
      response.cookie.calledWith(
        'Authentication',
        Sinon.match.string,
        {
          httpOnly: true,
          expires: Sinon.match.date,
        },
      ),
    ).toBeTruthy();
  });

  it('should get user for jwt strategy', async () => {
    const id = 'object id';
    userService.findById.resolves({ _id: id });

    const user = await service.getUserForJwtStrategy(id);

    expect(user).toStrictEqual({ _id: id });
  });

  it('should throw unauthorized exception on get user for jwt strategy with non-existing id', async () => {
    const id = 'object id';
    userService.findById.rejects(new NotFoundException());

    const result = service.getUserForJwtStrategy(id);

    await expect(result).rejects.toThrowError(
      new UnauthorizedException(),
    );
  });

  it('should rethrow any exception on get user for jwt strategy when it is not UnauthorizedException', async () => {
    const id = 'object id';
    userService.findById.rejects(new Error());

    const result = service.getUserForJwtStrategy(id);

    await expect(result).rejects.toThrowError(new Error());
  });
});
