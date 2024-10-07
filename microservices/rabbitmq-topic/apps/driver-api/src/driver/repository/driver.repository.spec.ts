import { SinonMock, SinonMockType } from '@app/testing';
import { FilterQuery, Model } from 'mongoose';
import { Driver } from '../entities/driver.entity';
import { DriverRepository } from './driver.repository';

describe('DriverRepository', () => {
  let repository: DriverRepository;
  let model: SinonMockType<Model<Driver>>;

  beforeEach(() => {
    model = SinonMock.of(Model<Driver>);
    repository = new DriverRepository(model);
  });

  it.each<FilterQuery<Driver>>([
    { _id: 'object id' },
    { birthday: new Date().toISOString() },
  ])('should findOne', async (filter) => {
    model.findOne.withArgs(filter).resolves({
      toObject: jest.fn(
        () => ({ _id: 'object id' as any } as Partial<Driver>),
      ),
    });

    const reservation = await repository.findOne(filter);

    expect(reservation).toStrictEqual({
      _id: 'object id',
    });
  });

  it('should not findOne', async () => {
    model.findOne
      .withArgs({ _id: 'mongodb object id' })
      .resolves(undefined);

    const reservation = await repository.findOne({
      _id: 'mongodb object id',
    });

    expect(reservation).toBeUndefined();
  });
});
