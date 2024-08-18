import { generateRandomString } from '@app/common';
import { CreateUserDto, UserServiceApi } from '../../../api-client';

describe('User service (e2e - validation)', () => {
  let userServiceApi: UserServiceApi;

  beforeAll(() => {
    userServiceApi = new UserServiceApi();
  });

  it.each<CreateUserDto>([
    {
      email: generateRandomString(13),
      password: '1aBc1234',
    },
    {
      email: generateRandomString(13) + '@ex.cn',
    } as CreateUserDto,
  ])(
    'should throw error on invalid/missing data',
    async (createUserDto) => {
      const { status } = await userServiceApi.userControllerCreate(
        {
          createUserDto,
        },
        {
          validateStatus(status) {
            return status > 200;
          },
        },
      );

      expect(status).toBe(400);
    },
  );

  it.each<string>([
    '$h0rt',
    '123456789',
    'just letter',
    'JUST UPPERCASE',
    'no-uppercase-123',
  ])(
    'should throw error on non-conforming password',
    async (nonConformingPassword) => {
      const { status, data } =
        await userServiceApi.userControllerCreate(
          {
            createUserDto: {
              email: 'some@example.com',
              password: nonConformingPassword,
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
        message: ['password is not strong enough'],
        statusCode: 400,
      });
    },
  );
});
