import { generateRandomString } from '@app/common';
import { login } from '@app/testing';
import {
  CreateUserDto,
  MeDto,
  UserServiceApi,
} from '../../../api-client';
import { UserBuilder } from '../../builders/user.builder';

describe('User service (e2e - business logic)', () => {
  let userServiceApi: UserServiceApi;

  beforeAll(() => {
    userServiceApi = new UserServiceApi();
  });

  it.each<CreateUserDto>([
    {
      email: generateRandomString(13) + '@ex.jp',
      password: '1aB!1234',
    },
    {
      email: generateRandomString(13) + '@ex.cn',
      password: '1aB!1234',
    },
  ])('should create user', async (createUserDto) => {
    const { data: userId } =
      await userServiceApi.userControllerCreate({
        createUserDto,
      });

    expect(userId).toEqual(expect.any(String));
  });

  it('should throw bad request on duplicate email while creating user', async () => {
    const duplicateEmail = generateRandomString() + '@salt.com';
    await new UserBuilder().setEmail(duplicateEmail).build();

    const { status, data } =
      await userServiceApi.userControllerCreate(
        {
          createUserDto: {
            email: duplicateEmail,
            password: '12Pq$#09',
          },
        },
        {
          validateStatus(status) {
            return status > 200;
          },
        },
      );

    expect(status).toBe(400);
    expect(data).toStrictEqual({
      error: 'Bad Request',
      message: 'email already exists.',
      statusCode: 400,
    });
  });

  it('should return user data', async () => {
    const email = generateRandomString() + '@asp.net';
    const password = '#Pyth0n4me';
    await new UserBuilder()
      .setEmail(email)
      .setPassword(password)
      .build();
    const cookie = await login(email, password);

    const { data } = await userServiceApi.userControllerMe({
      headers: {
        Cookie: cookie,
      },
    });

    expect(data).toStrictEqual({
      _id: expect.any(String),
      email,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    } as MeDto);
  });
});
