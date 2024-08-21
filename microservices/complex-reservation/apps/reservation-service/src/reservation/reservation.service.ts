import {
  ChargeMicroservicesPayload,
  ChargeResponseDto,
  MESSAGE_PATTERN_FOR_CHARGING_USER,
  PAYMENT_SERVICE,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentClient: ClientProxy,
  ) {}

  create(userId: string, createReservationDto: CreateReservationDto) {
    const { token, amount, start, end, ...rest } =
      createReservationDto;
    const observable = this.paymentClient.send<
      ChargeResponseDto,
      ChargeMicroservicesPayload
    >(MESSAGE_PATTERN_FOR_CHARGING_USER, {
      token,
      amount,
    });

    return observable.pipe(
      map((paymentResponse) => {
        return this.reservationRepository.create({
          userId,
          ...rest,
          end: new Date(end),
          start: new Date(start),
          invoiceId: paymentResponse.id,
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
