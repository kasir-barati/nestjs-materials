import { generateRandomString } from '@app/common';
import { AuthServiceApi } from '../../../api-client';
import { UserBuilder } from '../../builders/user.builder';

describe('Auth service (e2e - business logic)', () => {
  let authServiceApi: AuthServiceApi;

  beforeAll(() => {
    authServiceApi = new AuthServiceApi();
  });

  it('should login user', async () => {
    const email = generateRandomString() + '@my.me';
    const password = '1,2It9876';
    await new UserBuilder()
      .setEmail(email)
      .setPassword(password)
      .build();

    const { status, headers } =
      await authServiceApi.authServiceControllerLogin({
        data: {
          email,
          password,
        },
      });

    expect(status).toBe(200);
    expect(
      headers['set-cookie'].find((cookie) =>
        cookie.includes('Authentication'),
      ),
    ).toBeDefined();
  });

  it('should throw unauthorized exception on invalid email', async () => {
    const incorrectEmail = generateRandomString() + '@my.me';
    const password = '1,2It9876';
    await new UserBuilder().setPassword(password).build();

    const { status, headers } =
      await authServiceApi.authServiceControllerLogin({
        data: {
          email: incorrectEmail,
          password,
        },
        validateStatus(status) {
          return status > 200;
        },
      });

    expect(status).toBe(401);
    expect(headers.Authentication).toBeUndefined();
  });

  it('should throw unauthorized exception on invalid password', async () => {
    const email = generateRandomString() + '@my.me';
    const incorrectPassword = '1,2It9876';
    await new UserBuilder().setEmail(email).build();

    const { status, headers } =
      await authServiceApi.authServiceControllerLogin({
        data: {
          email,
          password: incorrectPassword,
        },
        validateStatus(status) {
          return status > 200;
        },
      });

    expect(status).toBe(401);
    expect(headers.Authentication).toBeUndefined();
  });
});
