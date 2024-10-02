import { generateRandomString } from '@app/testing';
import { Types } from 'mongoose';
import { AuthApi } from '../api-client';

describe('Auth API (e2e)', () => {
  let authApi: AuthApi;

  beforeAll(() => {
    authApi = new AuthApi();
  });

  it('should create a user', async () => {
    // Arrange
    const id = new Types.ObjectId().toString();
    const email = generateRandomString() + '@some.jp';
    const password = generateRandomString() + '123' + 'asd';

    // Act
    const { data, status } =
      await authApi.authControllerCreateOrUpdateUser(
        {
          id,
          createOrUpdateUserDto: {
            email,
            password,
          },
        },
        {
          headers: {
            'content-type': 'application/merge-patch+json',
          },
        },
      );

    // Assert
    expect(status).toBe(201);
    expect(data._id).toBe(id);
    expect(data.email).toBe(email);
  });
});
