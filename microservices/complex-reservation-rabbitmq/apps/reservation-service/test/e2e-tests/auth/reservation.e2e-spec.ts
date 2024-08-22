import { SinonMock } from '@app/common';
import { ReservationServiceApi } from '../../../api-client';

describe('Reservation service (e2e - auth)', () => {
  let reservationServiceApi: ReservationServiceApi;

  beforeAll(() => {
    reservationServiceApi = new ReservationServiceApi();
  });

  it('should throw 403 on creating a new reservation', async () => {
    const { data, status } =
      await reservationServiceApi.reservationControllerCreate(
        {
          createReservationDto: SinonMock.with({}),
        },
        {
          validateStatus(status) {
            return status > 200;
          },
        },
      );

    expect(data).toStrictEqual({
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    });
    expect(status).toBe(403);
  });

  it('should throw 403 on reading all reservations', async () => {
    const { data, status } =
      await reservationServiceApi.reservationControllerRead({
        validateStatus(status) {
          return status > 200;
        },
      });

    expect(data).toStrictEqual({
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    });
    expect(status).toBe(403);
  });

  it('should throw 403 on finding reservation by id', async () => {
    const { data, status } =
      await reservationServiceApi.reservationControllerFindById(
        {
          id: '66c3718b56a3ffbc1a21c7c3',
        },
        {
          validateStatus(status) {
            return status > 200;
          },
        },
      );

    expect(data).toStrictEqual({
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    });
    expect(status).toBe(403);
  });

  it('should throw 403 on updating reservation', async () => {
    const { data, status } =
      await reservationServiceApi.reservationControllerUpdate(
        {
          id: '66c3719cb46e2b353af77d41',
          updateReservationDto: {
            start: new Date().toString(),
          },
        },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
          },
          validateStatus(status) {
            return status > 200;
          },
        },
      );

    expect(data).toStrictEqual({
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    });
    expect(status).toBe(403);
  });

  it('should throw 403 on replacing reservation', async () => {
    const { data, status } =
      await reservationServiceApi.reservationControllerReplace(
        {
          id: '66c371d7f437f8a6bf4e7f3e',
          replaceReservationDto: SinonMock.with({}),
        },
        {
          validateStatus(status) {
            return status > 200;
          },
        },
      );

    expect(data).toStrictEqual({
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    });
    expect(status).toBe(403);
  });

  it('should throw 403 on deleting reservation', async () => {
    const { status, data } =
      await reservationServiceApi.reservationControllerDelete(
        {
          id: '66c372381fee8dd696692f81',
        },
        {
          validateStatus(status) {
            return status > 200;
          },
        },
      );

    expect(data).toStrictEqual({
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    });
    expect(status).toBe(403);
  });
});
