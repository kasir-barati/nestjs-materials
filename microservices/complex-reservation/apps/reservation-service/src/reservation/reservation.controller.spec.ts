import { Pagination, SinonMock, SinonMockType } from '@app/common';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: SinonMockType<ReservationService>;

  beforeEach(() => {
    service = SinonMock.of(ReservationService);
    controller = new ReservationController(service);
  });

  it('should create a reservation', async () => {
    const requestBody = {
      end: new Date(),
      start: new Date(),
      invoiceId: 'object id',
      locationId: 'object id',
    };
    service.create.withArgs('user id', requestBody).resolves({
      ...requestBody,
      userId: 'user id',
      _id: 'object id',
    });

    const reservation = await controller.create(requestBody);

    expect(reservation).toStrictEqual({
      ...requestBody,
      userId: 'user id',
      _id: 'object id',
    });
  });

  it('should read reservations', async () => {
    const result: Pagination<Reservation> = {
      data: [],
      page: 1,
      next: 1,
      prev: 1,
      total: 1,
      limit: 10,
      lastPage: 1,
    };
    service.read.resolves(result);

    const reservation = await controller.read();

    expect(reservation).toStrictEqual(result);
  });

  it.each<string>(['object id 1', 'object id 2'])(
    'should find reservation by id: %s',
    async (id) => {
      service.findById
        .withArgs(id)
        .resolves(SinonMock.with<Reservation>({ _id: id }));

      const reservation = await controller.findById(id);

      expect({ ...reservation }).toStrictEqual({ _id: id });
    },
  );

  it.each<{ id: string; updateReservationDto: UpdateReservationDto }>(
    [
      {
        id: 'object id 1',
        updateReservationDto: { end: new Date() },
      },
      {
        id: 'object id 2',
        updateReservationDto: {
          start: new Date('2022'),
          end: new Date('2023'),
        },
      },
    ],
  )(
    'should patch reservation: %p',
    async ({ id, updateReservationDto }) => {
      service.update.withArgs(id, updateReservationDto).resolves(
        SinonMock.with<Reservation>({
          _id: id,
          ...updateReservationDto,
        }),
      );

      const reservation = await controller.update(
        id,
        updateReservationDto,
      );

      expect({ ...reservation }).toStrictEqual({
        _id: id,
        ...updateReservationDto,
      });
    },
  );

  it('should delete reservation', async () => {
    service.delete.resolves();

    const result = await controller.delete('object id');

    expect(result).toBeUndefined();
  });
});
