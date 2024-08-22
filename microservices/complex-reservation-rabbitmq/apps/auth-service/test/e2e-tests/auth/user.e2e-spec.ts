import { UserServiceApi } from '../../../api-client';

describe('User service (e2e - auth)', () => {
  let userServiceApi: UserServiceApi;

  beforeAll(() => {
    userServiceApi = new UserServiceApi();
  });

  it('should throw 401 on trying to get user data without jwt token', async () => {
    const { data, status } = await userServiceApi.userControllerMe({
      validateStatus(status) {
        return status > 200;
      },
    });

    expect(status).toBe(401);
    expect(data).toStrictEqual({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });
});
