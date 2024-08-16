import { Pagination, SinonMock, SinonMockType } from '@app/common';
import { ReplaceReservationDto } from './dto/replace-reservation.dto';
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
      end: new Date().toISOString(),
      start: new Date().toISOString(),
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
        updateReservationDto: { end: new Date().toISOString() },
      },
      {
        id: 'object id 2',
        updateReservationDto: {
          start: new Date('2022').toISOString(),
          end: new Date('2023').toISOString(),
        },
      },
    ],
  )(
    'should patch reservation: %p',
    async ({ id, updateReservationDto }) => {
      const { start, end, ...rest } = updateReservationDto;
      service.update.withArgs(id, updateReservationDto).resolves(
        SinonMock.with<Reservation>({
          _id: id,
          ...rest,
          ...(end ? { end: new Date(end) } : {}),
          ...(start ? { start: new Date(start) } : {}),
        }),
      );

      const reservation = await controller.update(
        id,
        updateReservationDto,
        { 'content-type': 'application/merge-patch+json' },
      );

      expect({ ...reservation }).toStrictEqual({
        _id: id,
        ...rest,
        ...(end ? { end: new Date(end) } : {}),
        ...(start ? { start: new Date(start) } : {}),
      });
    },
  );

  it('should replace reservation', async () => {
    const id = 'object id 2';
    const replaceReservationDto: ReplaceReservationDto = {
      invoiceId: 'object id',
      locationId: 'object id',
      start: new Date('2022').toISOString(),
      end: new Date('2023').toISOString(),
    };
    const { start, end, ...rest } = replaceReservationDto;
    service.update.withArgs(id, replaceReservationDto).resolves(
      SinonMock.with<Reservation>({
        _id: id,
        ...rest,
        end: new Date(end),
        start: new Date(start),
      }),
    );

    const reservation = await controller.replace(
      id,
      replaceReservationDto,
    );

    expect({ ...reservation }).toStrictEqual({
      _id: id,
      ...rest,
      end: new Date(end),
      start: new Date(start),
    });
  });

  it('should delete reservation', async () => {
    service.delete.resolves();

    const result = await controller.delete('object id');

    expect(result).toBeUndefined();
  });
});
