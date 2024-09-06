import {
  AttachedUserToTheRequest,
  Pagination,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { Response } from 'express';
import { CreateOrUpdateReservationDto } from './dto/create-reservation.dto';
import { ReplaceReservationDto } from './dto/replace-reservation.dto';
import { CreatedOrUpdatedReservationDto } from './dto/response.dto';
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
    const requestBody: CreateOrUpdateReservationDto = {
      end: new Date().toISOString(),
      start: new Date().toISOString(),
      locationId: 'object id',
      amount: 12312312,
      token: 'tok_123',
    };
    const user = SinonMock.with<AttachedUserToTheRequest>({
      _id: 'user id',
    });
    const mockSend = jest.fn();
    const mockStatus = jest.fn(() => ({ send: mockSend }));
    const response = SinonMock.with<Response>({ status: mockStatus });
    service.createOrUpdate
      .withArgs({
        id: 'object id',
        user,
        createOrUpdateReservationDto: requestBody,
      })
      .resolves(
        SinonMock.with<
          Awaited<ReturnType<ReservationService['createOrUpdate']>>
        >({
          status: 'created',
          data: {
            userId: 'user id',
            _id: 'object id' as any,
            invoiceId: 'invoice id from stripe',
            locationId: requestBody.locationId,
            end: requestBody.end as any,
            start: requestBody.start as any,
          } as CreatedOrUpdatedReservationDto,
        }),
      );

    await controller.createOrUpdate(
      'object id',
      user,
      requestBody,
      { 'content-type': 'application/merge-patch+json' },
      response,
    );

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        invoiceId: 'invoice id from stripe',
        locationId: requestBody.locationId,
        start: requestBody.start,
        end: requestBody.end,
        userId: 'user id',
        _id: 'object id',
      }),
    );
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

  it.each<{
    id: string;
    createOrUpdateReservationDto: CreateOrUpdateReservationDto;
  }>([
    {
      id: 'object id 1',
      createOrUpdateReservationDto: { end: new Date().toISOString() },
    },
    {
      id: 'object id 2',
      createOrUpdateReservationDto: {
        start: new Date('2022').toISOString(),
        end: new Date('2023').toISOString(),
      },
    },
  ])(
    'should patch reservation: %p',
    async ({ id, createOrUpdateReservationDto }) => {
      const { start, end, ...rest } = createOrUpdateReservationDto;
      const mockSend = jest.fn();
      const mockStatus = jest.fn(() => ({ send: mockSend }));
      const response = SinonMock.with<Response>({
        status: mockStatus,
      });
      const user = SinonMock.with<AttachedUserToTheRequest>({});
      service.createOrUpdate
        .withArgs({ id, user, createOrUpdateReservationDto })
        .resolves(
          SinonMock.with<
            Awaited<ReturnType<ReservationService['createOrUpdate']>>
          >({
            status: 'updated',
            data: {
              _id: id as any,
              ...rest,
              ...(end ? { end: new Date(end) } : {}),
              ...(start ? { start: new Date(start) } : {}),
            } as CreatedOrUpdatedReservationDto,
          }),
        );

      await controller.createOrUpdate(
        id,
        user,
        createOrUpdateReservationDto,
        { 'content-type': 'application/merge-patch+json' },
        response,
      );

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith({
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
    service.delete.resolves(true);
    const mockStatus = jest.fn(() => ({ send: jest.fn() }));
    const response = SinonMock.with<Response>({
      status: mockStatus,
    });

    await controller.delete('object id', response);

    expect(mockStatus).toHaveBeenCalledWith(200);
  });

  it('should could not find the reservation to delete it', async () => {
    service.delete.resolves(false);
    const mockStatus = jest.fn(() => ({ send: jest.fn() }));
    const response = SinonMock.with<Response>({
      status: mockStatus,
    });

    await controller.delete('object id', response);

    expect(mockStatus).toHaveBeenCalledWith(204);
  });
});
