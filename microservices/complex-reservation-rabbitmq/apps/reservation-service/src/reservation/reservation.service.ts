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
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, tap } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
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

  create(
    user: AttachedUserToTheRequest,
    createReservationDto: CreateReservationDto,
  ) {
    const { token, amount, start, end, ...rest } =
      createReservationDto;
    const observable = this.paymentServiceClient.send<
      ChargeResponseDto,
      ChargeMicroservicesPayload
    >(MESSAGE_PATTERN_FOR_CHARGING_USER, {
      token,
      amount,
    });
    console.log();
    console.log();
    console.log('43. Service');
    console.log();

    return observable.pipe(
      map((paymentResponse) => {
        console.log();
        console.log();
        console.log('50. Service');
        console.dir(paymentResponse, { depth: null });
        console.log();
        return this.reservationRepository.create({
          userId: user._id,
          ...rest,
          end: new Date(end),
          start: new Date(start),
          invoiceId: paymentResponse.id,
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
    );
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
}
