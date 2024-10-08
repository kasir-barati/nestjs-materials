import {
  generateRandomString,
  getMail,
  getTempUser,
  login,
} from '@app/common';
import { Types } from 'mongoose';
import {
  CreateOrUpdateReservationDto,
  ReplaceReservationDto,
  ReservationServiceApi,
} from '../../../api-client';
import { ReservationBuilder } from '../../builders/reservation.builder';
import { UserBuilder } from '../../builders/user.builder';
import { ReservationDestroyer } from '../../destroyers/reservation.destroyer';

describe('Reservation service (e2e - business logic)', () => {
  let reservationServiceApi: ReservationServiceApi;
  const user = getTempUser();

  beforeAll(() => {
    reservationServiceApi = new ReservationServiceApi();
  });

  it('should create a new reservation', async () => {
    const email = generateRandomString() + '@cnr.com';
    const password = 'alkm12ASpo@#';
    const userId = await new UserBuilder()
      .setEmail(email)
      .setPassword(password)
      .build();
    const authenticationJwtCookie = await login(email, password);
    const reservationId = new Types.ObjectId().toString();
    const createReservationDto: CreateOrUpdateReservationDto = {
      end: new Date().toISOString(),
      start: new Date().toISOString(),
      locationId: '66be17356d013c36717843e9',
      amount: 12312312,
      token: 'pm_card_visa',
    };

    const { data: reservation, status } =
      await reservationServiceApi.reservationControllerCreateOrUpdate(
        {
          id: reservationId,
          createOrUpdateReservationDto: createReservationDto,
        },
        {
          headers: {
            'Cookie': authenticationJwtCookie,
            'Content-Type': 'application/merge-patch+json',
          },
        },
      );

    expect(reservation).toStrictEqual({
      __v: expect.any(Number),
      _id: reservationId,
      userId,
      invoiceId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      end: createReservationDto.end,
      start: createReservationDto.start,
      locationId: createReservationDto.locationId,
    });
    expect(status).toBe(201);
    expect(await getMail(email)).toBeDefined();
  }, 20000);

  it('should NOT recreate an already existing reservation but just update it', async () => {
    const email = generateRandomString() + '@cnr.com';
    const password = 'alkm12ASpo@#';
    await new UserBuilder()
      .setEmail(email)
      .setPassword(password)
      .build();
    const authenticationJwtCookie = await login(email, password);
    const reservationId = new Types.ObjectId().toString();
    const createOrUpdateReservationDto: CreateOrUpdateReservationDto =
      {
        end: new Date().toISOString(),
        start: new Date().toISOString(),
        locationId: '66be17356d013c36717843e9',
        amount: 12312312,
        token: 'pm_card_visa',
      };
    await new ReservationBuilder()
      .setId(reservationId)
      .setEnd(createOrUpdateReservationDto.end)
      .setStart(createOrUpdateReservationDto.start)
      .setToken(createOrUpdateReservationDto.token)
      .setAmount(createOrUpdateReservationDto.amount)
      .setLocationId(createOrUpdateReservationDto.locationId)
      .build();

    const { data: reservation, status } =
      await reservationServiceApi.reservationControllerCreateOrUpdate(
        {
          id: reservationId,
          createOrUpdateReservationDto,
        },
        {
          headers: {
            'Cookie': authenticationJwtCookie,
            'Content-Type': 'application/merge-patch+json',
          },
        },
      );

    expect(reservation).toStrictEqual({
      __v: expect.any(Number),
      _id: expect.any(String),
      userId: expect.any(String),
      invoiceId: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      end: createOrUpdateReservationDto.end,
      start: createOrUpdateReservationDto.start,
      locationId: createOrUpdateReservationDto.locationId,
    });
    expect(status).toBe(200);
    expect(await getMail(email)).toBeUndefined();
  });

  it('should read all reservations', async () => {
    const authenticationJwtCookie = await login(
      user.email,
      user.password,
    );
    await new ReservationBuilder().build();

    const { data } =
      await reservationServiceApi.reservationControllerRead({
        headers: {
          Cookie: authenticationJwtCookie,
        },
      });

    expect(data.data.length).toBeGreaterThanOrEqual(1);
    expect(data.page).toBe(1);
    expect(data.limit).toBe(10);
  });

  it('should find reservation by id', async () => {
    const authenticationJwtCookie = await login(
      user.email,
      user.password,
    );
    const id = await new ReservationBuilder().build();

    const { data: reservation } =
      await reservationServiceApi.reservationControllerFindById(
        {
          id,
        },
        {
          headers: {
            Cookie: authenticationJwtCookie,
          },
        },
      );

    expect(reservation._id).toBe(id);
  });

  it('should update reservation', async () => {
    const authenticationJwtCookie = await login(
      user.email,
      user.password,
    );
    const id = await new ReservationBuilder().build();
    const newStart = new Date('2010').toISOString();

    const { data: reservation, config } =
      await reservationServiceApi.reservationControllerCreateOrUpdate(
        {
          id,
          createOrUpdateReservationDto: {
            start: newStart,
          },
        },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
            'Cookie': authenticationJwtCookie,
          },
        },
      );

    expect(reservation.start).toBe(newStart);
  });

  it('should replace reservation', async () => {
    const authenticationJwtCookie = await login(
      user.email,
      user.password,
    );
    const id = await new ReservationBuilder().build();
    const replaceReservationDto: ReplaceReservationDto = {
      end: new Date('2019').toISOString(),
      start: new Date('2018').toISOString(),
      invoiceId: '66bf3c870022fff2ec279a52',
      locationId: '66bf3c8f1855b23ca852efce',
    };

    const { data: reservation } =
      await reservationServiceApi.reservationControllerReplace(
        {
          id,
          replaceReservationDto,
        },
        {
          headers: {
            Cookie: authenticationJwtCookie,
          },
        },
      );

    expect(reservation).toStrictEqual(
      expect.objectContaining({
        _id: id,
        ...replaceReservationDto,
      }),
    );
  });

  it('should delete reservation', async () => {
    const authenticationJwtCookie = await login(
      user.email,
      user.password,
    );
    const id = await new ReservationBuilder().build();

    const { status } =
      await reservationServiceApi.reservationControllerDelete(
        {
          id,
        },
        {
          headers: {
            Cookie: authenticationJwtCookie,
          },
        },
      );

    expect(status).toBe(200);
  });

  it('should return 204 on deleting non-existing reservation', async () => {
    const authenticationJwtCookie = await login(
      user.email,
      user.password,
    );
    const id = await new ReservationBuilder().build();
    await new ReservationDestroyer(id).destroy();

    const { status } =
      await reservationServiceApi.reservationControllerDelete(
        {
          id,
        },
        {
          headers: {
            Cookie: authenticationJwtCookie,
          },
        },
      );

    expect(status).toBe(204);
  });
});
