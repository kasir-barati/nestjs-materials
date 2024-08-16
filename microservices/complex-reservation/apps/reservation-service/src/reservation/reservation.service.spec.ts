import { Pagination, SinonMock, SinonMockType } from '@app/common';
import { Types } from 'mongoose';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: SinonMockType<ReservationRepository>;

  beforeEach(() => {
    repository = SinonMock.of(ReservationRepository);
    service = new ReservationService(repository);
  });

  it('should create reservation', async () => {
    const createReservationDto = SinonMock.with<CreateReservationDto>(
      {},
    );
    repository.create
      .withArgs({
        userId: 'object id',
        ...createReservationDto,
      })
      .resolves({
        _id: 'new object id',
        userId: 'object id',
        ...createReservationDto,
      });

    const result = await service.create(
      'object id',
      createReservationDto,
    );

    expect(result).toStrictEqual({
      _id: 'new object id',
      userId: 'object id',
      ...createReservationDto,
    });
  });

  it('should read reservations', async () => {
    const resolvedValue = SinonMock.with<Pagination<Reservation>>({
      page: 1,
      limit: 10,
    });
    repository.read
      .withArgs({}, { page: 1, limit: 10 })
      .resolves(resolvedValue);

    const result = await service.read();

    expect({ ...result }).toStrictEqual({ ...resolvedValue });
  });

  it('should find reservation by id', async () => {
    const id = new Types.ObjectId();
    const resolvedValue = SinonMock.with<Reservation>({});
    repository.findById
      .withArgs(id.toString())
      .resolves(resolvedValue);

    const result = await service.findById(id.toString());

    expect({ ...result }).toStrictEqual({ ...resolvedValue });
  });

  it('should update reservation by id', async () => {
    const resolvedValue = SinonMock.with<Reservation>({});
    const updateReservationDto: UpdateReservationDto = {
      end: new Date(),
      start: new Date(),
    };
    repository.findById
      .withArgs('Some object id')
      .resolves(resolvedValue);

    const result = await service.update(
      'Some object id',
      updateReservationDto,
    );

    expect({ ...result }).toStrictEqual({ ...resolvedValue });
  });

  it('should delete reservation by id', async () => {
    repository.findById.withArgs('Some object id').resolves();

    const result = await service.delete('Some object id');

    expect(result).toBeUndefined();
  });
});
