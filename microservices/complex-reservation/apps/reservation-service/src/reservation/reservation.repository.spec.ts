import { SinonMock, SinonMockType } from '@app/common';
import { FilterQuery, Model } from 'mongoose';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservation.repository';

describe('ReservationRepository', () => {
  let repository: ReservationRepository;
  let model: SinonMockType<Model<Reservation>>;

  beforeEach(() => {
    model = SinonMock.of(Model<Reservation>);
    repository = new ReservationRepository(model);
  });

  it.each<FilterQuery<Reservation>>([
    { userId: 'user id' },
    { invoiceId: 'some stripe id' },
  ])('should findOne', async (filter) => {
    model.findOne.withArgs(filter).resolves({
      toObject: jest.fn(
        () => ({ _id: 'object id' as any } as Partial<Reservation>),
      ),
    });

    const reservation = await repository.findOne(filter);

    expect(reservation).toStrictEqual({
      _id: 'object id',
    });
  });
});
