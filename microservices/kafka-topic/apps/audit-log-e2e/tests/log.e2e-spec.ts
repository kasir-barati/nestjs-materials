import { generateRandomString } from '@app/testing';
import { Types } from 'mongoose';
import { LogApi } from '../api-client';
import { UserBuilder } from '../builders/user.builder';

describe('Log API (e2e)', () => {
  let logApi: LogApi;

  beforeAll(() => {
    logApi = new LogApi();
  });

  it('should read all logs', async () => {
    // Arrange
    const userId = new Types.ObjectId().toString();
    const userEmail = generateRandomString() + '@asda.cas';
    await new UserBuilder().setId(userId).setEmail(userEmail).build();

    // Act
    const { data, status } = await logApi.auditLogControllerRead();

    console.dir(data, { depth: null });

    // Assert
    expect(status).toBe(200);
    expect(data.data).toBeArray();
    expect(data.data).toEqual(
      expect.arrayContaining(
        expect.objectContaining({
          afterEvent: expect.objectContaining({
            _id: userId,
            email: userEmail,
          }),
        }),
      ),
    );
  });
});
