import {
  CreateReservationDto,
  ReplaceReservationDto,
  ReservationServiceApi,
} from '../../../api-client';

describe('Reservation service (e2e - validation)', () => {
  let reservationServiceApi: ReservationServiceApi;
  const createReservationDto: CreateReservationDto = {
    end: new Date().toISOString(),
    start: new Date().toISOString(),
    invoiceId: '66be172a5d93fb9303e46ae3',
    locationId: '66be17356d013c36717843e9',
  };

  beforeAll(() => {
    reservationServiceApi = new ReservationServiceApi();
  });

  it.each([
    {
      ...createReservationDto,
      end: '12312',
    },
    {
      ...createReservationDto,
      start: 123.123,
    },
    {
      ...createReservationDto,
      invoiceId: false,
    },
    {
      ...createReservationDto,
      locationId: 123,
    },
    {},
    {
      start: new Date().toISOString(),
    },
  ])(
    'should throw error on creating a new reservation with garbage data: %p',
    async (createReservationDto: CreateReservationDto) => {
      const { status } =
        await reservationServiceApi.reservationControllerCreate(
          {
            createReservationDto,
          },
          {
            validateStatus(status) {
              return status > 200;
            },
          },
        );

      expect(status).toBe(400);
    },
  );

  it('should throw error on fetching reservation with bad id', async () => {
    const { status } =
      await reservationServiceApi.reservationControllerFindById(
        {
          id: 'garbage value',
        },
        {
          validateStatus(status) {
            return status > 200;
          },
        },
      );

    expect(status).toBe(400);
  });

  it('should throw error on updating reservation with garbage data or id', async () => {
    const { status } =
      await reservationServiceApi.reservationControllerUpdate(
        {
          id: true as unknown as string,
          updateReservationDto: {
            start: 123 as unknown as string,
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

    expect(status).toBe(400);
  });

  it('should throw error on replacing reservation with garbage data, and id', async () => {
    const { status } =
      await reservationServiceApi.reservationControllerReplace(
        {
          id: 123 as unknown as string,
          replaceReservationDto: {
            start: 123 as unknown as string,
            end: new Date().toISOString(),
            invoiceId: '66bf58b4cd4909241798e00a',
            locationId: '66bf58bcd83d946cc9ae38bb',
          } as ReplaceReservationDto,
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

    expect(status).toBe(400);
  });

  it('should throw error on replacing reservation if some fields are missing', async () => {
    const { status } =
      await reservationServiceApi.reservationControllerReplace(
        {
          id: '66bf589cec6be699439d46d0',
          replaceReservationDto: {
            start: 123 as unknown as string,
          } as ReplaceReservationDto,
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

    expect(status).toBe(400);
  });

  it('should throw error on deleting reservation with garbage id', async () => {
    const { status } =
      await reservationServiceApi.reservationControllerDelete(
        {
          id: 'non-objectId',
        },
        {
          validateStatus(status) {
            return status > 200;
          },
        },
      );

    expect(status).toBe(400);
  });
});
