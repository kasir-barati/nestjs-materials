import { generateRandomString } from '@app/common';
import { CreateUserDto, UserServiceApi } from '../../../api-client';

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
});
