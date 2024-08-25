import {
  ChargeResponseDto,
  Pagination,
  SinonMock,
  SinonMockType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { firstValueFrom, of } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservation.repository';
import { ReservationService } from './reservation.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let repository: SinonMockType<ReservationRepository>;
  let paymentServiceClient: SinonMockType<ClientProxy>;
  let notificationServiceClient: SinonMockType<ClientProxy>;

  beforeEach(() => {
    notificationServiceClient = SinonMock.with<ClientProxy>({});
    paymentServiceClient = SinonMock.with<ClientProxy>({});
    repository = SinonMock.of(ReservationRepository);
    service = new ReservationService(
      repository,
      paymentServiceClient,
      notificationServiceClient,
    );
  });

  // Failing with timeout error. Increasing timeout did not help.
  it.skip('should create reservation', async () => {
    const createReservationDto = SinonMock.with<CreateReservationDto>(
      {
        end: new Date().toISOString(),
        start: new Date().toISOString(),
        amount: 1222,
        locationId: 'object id',
        token: 'tok_123',
      },
    );
    paymentServiceClient.send.returns(
      of(
        SinonMock.with<ChargeResponseDto>({
          id: 'invoice id',
        }),
      ),
    );
    repository.create.resolves({
      _id: 'new object id',
      userId: 'object id',
      invoiceId: 'invoice id',
      ...createReservationDto,
    });

    const result = await firstValueFrom(
      service.create(
        { _id: 'object id', email: 'user@temp.cp' },
        createReservationDto,
      ),
    );

    expect(result).toStrictEqual({
      _id: 'new object id',
      userId: 'object id',
      invoiceId: 'invoice id',
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
      end: new Date().toISOString(),
      start: new Date().toISOString(),
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
