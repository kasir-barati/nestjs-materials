import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationRepository extends AbstractRepository<Reservation> {
  protected readonly logger = new Logger(ReservationRepository.name);

  constructor(
    @InjectModel(Reservation.name)
    protected readonly model: Model<Reservation>,
  ) {
    super(model);
  }
}