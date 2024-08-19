import {
  ReplaceReservationDto,
  ReservationServiceApi,
} from '../../../api-client';
import { ReservationBuilder } from '../../builders/reservation.builder';

describe('Reservation service (e2e - business logic)', () => {
  let reservationServiceApi: ReservationServiceApi;

  beforeAll(() => {
    reservationServiceApi = new ReservationServiceApi();
  });

  it('should create a new reservation', async () => {
    const createReservationDto = {
      end: new Date().toISOString(),
      start: new Date().toISOString(),
      invoiceId: '66be172a5d93fb9303e46ae3',
      locationId: '66be17356d013c36717843e9',
    };

    const { data: reservation } =
      await reservationServiceApi.reservationControllerCreate({
        createReservationDto,
      });

    expect(reservation).toStrictEqual({
      __v: expect.any(Number),
      _id: expect.any(String),
      ...createReservationDto,
      userId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should read all reservations', async () => {
    await new ReservationBuilder().build();

    const { data } =
      await reservationServiceApi.reservationControllerRead();

    expect(data.data.length).toBeGreaterThanOrEqual(1);
    expect(data.page).toBe(1);
    expect(data.limit).toBe(10);
  });

  it('should find reservation by id', async () => {
    const id = await new ReservationBuilder().build();

    const { data: reservation } =
      await reservationServiceApi.reservationControllerFindById({
        id,
      });

    expect(reservation._id).toBe(id);
  });

  it('should update reservation', async () => {
    const id = await new ReservationBuilder().build();
    const newStart = new Date('2010').toISOString();

    const { data: reservation, config } =
      await reservationServiceApi.reservationControllerUpdate(
        {
          id,
          updateReservationDto: {
            start: newStart,
          },
        },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
        },
      );

    expect(reservation.start).toBe(newStart);
  });

  it('should replace reservation', async () => {
    const id = await new ReservationBuilder().build();
    const replaceReservationDto: ReplaceReservationDto = {
      end: new Date('2019').toISOString(),
      start: new Date('2018').toISOString(),
      invoiceId: '66bf3c870022fff2ec279a52',
      locationId: '66bf3c8f1855b23ca852efce',
    };

    const { data: reservation } =
      await reservationServiceApi.reservationControllerReplace({
        id,
        replaceReservationDto,
      });

    expect(reservation).toStrictEqual(
      expect.objectContaining({
        _id: id,
        ...replaceReservationDto,
      }),
    );
  });

  it('should delete reservation', async () => {
    const id = await new ReservationBuilder().build();

    const { status } =
      await reservationServiceApi.reservationControllerDelete({
        id,
      });

    expect(status).toBe(200);
  });
});