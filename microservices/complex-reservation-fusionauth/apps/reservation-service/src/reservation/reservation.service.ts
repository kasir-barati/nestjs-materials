import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
  ) {}

  create(userId: string, createReservationDto: CreateReservationDto) {
    const { start, end, ...rest } = createReservationDto;

    return this.reservationRepository.create({
      userId,
      ...rest,
      end: new Date(end),
      start: new Date(start),
    });
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
