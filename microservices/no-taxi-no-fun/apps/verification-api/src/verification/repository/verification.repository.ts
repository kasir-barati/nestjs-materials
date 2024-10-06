import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Verification } from '../entities/verification.entity';

@Injectable()
export class VerificationRepository extends AbstractRepository<Verification> {
  protected readonly logger = new Logger(VerificationRepository.name);

  constructor(
    @InjectModel(Verification.name)
    protected readonly model: Model<Verification>,
  ) {
    super(model);
  }
}
