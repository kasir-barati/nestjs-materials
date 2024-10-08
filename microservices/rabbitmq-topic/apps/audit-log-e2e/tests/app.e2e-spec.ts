import { Types } from 'mongoose';
import { LogApi } from '../api-client';
import { DriverBuilder } from '../builders/driver.builder';

describe('Log API (e2e)', () => {
  let logApi: LogApi;

  beforeAll(() => {
    logApi = new LogApi();
  });

  it('should read all logs', async () => {
    // Arrange
    const id = new Types.ObjectId().toString();
    await new DriverBuilder().setId(id).setGender('female').build();

    // Act
    const {
      data: { data, ...rest },
      status,
    } = await logApi.auditLogControllerRead();

    // Assert
    expect(status).toBe(200);
    expect(rest).toStrictEqual(
      expect.objectContaining({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        lastPage: expect.any(Number),
      }),
    );
    expect(rest.next).toBeOneOf([expect.any(Number), null]);
    expect(rest.prev).toBeOneOf([expect.any(Number), null]);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          afterEvent: expect.objectContaining({
            _id: id,
            gender: 'female',
          }),
        }),
      ]),
    );
  });
});
