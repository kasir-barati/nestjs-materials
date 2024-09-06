import {
  AttachedUserToTheRequest,
  ChargeMicroservicesPayload,
  ChargeResponseDto,
  EmailNotificationMicroservicesPayload,
  EVENT_PATTERN_FOR_EMAIL_NOTIFICATION,
  MESSAGE_PATTERN_FOR_CHARGING_USER,
  NOTIFICATION_SERVICE,
  PAYMENT_SERVICE,
} from '@app/common';
import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { lastValueFrom, map, tap } from 'rxjs';
import { CreateOrUpdateReservationDto } from './dto/create-reservation.dto';
import { CreatedOrUpdatedReservationDto } from './dto/response.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentServiceClient: ClientProxy,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationServiceClient: ClientProxy,
  ) {}

  /**
   * @description Idempotent method
   */
  async createOrUpdate({
    id,
    user,
    createOrUpdateReservationDto,
  }: {
    id: string;
    user: AttachedUserToTheRequest;
    createOrUpdateReservationDto: CreateOrUpdateReservationDto;
  }): Promise<{
    status: 'created' | 'updated';
    data: CreatedOrUpdatedReservationDto;
  }> {
    const { token, amount, ...rest } = createOrUpdateReservationDto;
    const reservation = await this.reservationRepository.findOne({
      _id: id,
    });

    if (reservation) {
      this.validateBeforeUpdate(createOrUpdateReservationDto);

      const updatedReservation =
        await this.reservationRepository.update(
          id,
          createOrUpdateReservationDto,
        );

      return { status: 'updated', data: updatedReservation };
    }

    this.validateBeforeCreate(createOrUpdateReservationDto);

    const observable = this.paymentServiceClient.send<
      ChargeResponseDto,
      ChargeMicroservicesPayload
    >(MESSAGE_PATTERN_FOR_CHARGING_USER, {
      token,
      amount,
    });
    const newReservation = await lastValueFrom(
      observable.pipe(
        map((paymentResponse) => {
          return this.reservationRepository.create({
            _id: new Types.ObjectId(id),
            userId: user._id,
            end: new Date(rest.end),
            start: new Date(rest.start),
            invoiceId: paymentResponse.id,
            locationId: rest.locationId,
          });
        }),
        tap(async (reservation) => {
          const { invoiceId } = await reservation;

          this.notificationServiceClient.emit<
            any,
            EmailNotificationMicroservicesPayload
          >(EVENT_PATTERN_FOR_EMAIL_NOTIFICATION, {
            email: user.email,
            html: `You're payment
          <small>(amount: ${amount}JP¥)</small>
          for this reservation
          <small>(reservation invoice id: ${invoiceId})</small>
          has been processed successfully.
          <br />
          Contact us on
          <a href="mailto:support@complex-reservation.jp" >
            support@complex-reservation.jp
          </a>.`,
          });
        }),
      ),
    );

    return { status: 'created', data: newReservation };
  }

  read() {
    return this.reservationRepository.read(
      {},
      { page: 1, limit: 10 },
    );
  }

  findById(id: string) {
    return this.reservationRepository.findById(id);
  }

  update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.update(
      id,
      updateReservationDto,
    );
  }

  delete(id: string) {
    return this.reservationRepository.delete(id);
  }

  private validateBeforeUpdate(data: CreateOrUpdateReservationDto) {
    if (data.end === null) {
      throw new BadRequestException('EmptyEndDate');
    }
    if (data.start === null) {
      throw new BadRequestException('EmptyStartDate');
    }
    if (data.locationId === null) {
      throw new BadRequestException('EmptyLocationId');
    }
  }

  private validateBeforeCreate(data: CreateOrUpdateReservationDto) {
    if (!data.end) {
      throw new BadRequestException('EmptyEndDate');
    }
    if (!data.start) {
      throw new BadRequestException('EmptyStartDate');
    }
    if (!data.locationId) {
      throw new BadRequestException('EmptyLocationId');
    }
  }
}
