import { sleep } from '@app/testing';
import { isMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { DriverApi } from '../api-client';

describe('Driver API (e2e)', () => {
  let driverApi: DriverApi;

  beforeAll(() => {
    driverApi = new DriverApi();
  });

  it('should create a driver', async () => {
    const id = new Types.ObjectId().toString();
    const birthday = new Date().toISOString();

    const { data } = await driverApi.driverControllerCreateOrUpdate(
      {
        id,
        createOrUpdateDriverDto: {
          name: 'Max',
          family: 'Jack',
          gender: 'male',
          birthday,
        },
      },
      {
        headers: {
          'content-type': 'application/merge-patch+json',
        },
      },
    );
    await sleep();
    const {
      data: { verificationId },
    } = await driverApi.driverControllerFindById({
      id,
    });

    expect(data).toEqual(
      expect.objectContaining({
        _id: id,
        name: 'Max',
        family: 'Jack',
        gender: 'male',
        birthday,
      }),
    );
    expect(isMongoId(verificationId)).toBeTruthy();
  }, 20_000);
});
