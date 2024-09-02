import { SinonMock, SinonMockType } from '@app/testing';
import { Model } from 'mongoose';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservation.repository';

describe('ReservationRepository', () => {
  let repository: ReservationRepository;
  let model: SinonMockType<Model<Reservation>>;

  beforeEach(() => {
    model = SinonMock.of(Model<Reservation>);
    repository = new ReservationRepository(model);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
