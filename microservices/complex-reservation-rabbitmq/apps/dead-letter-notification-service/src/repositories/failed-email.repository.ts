import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FailedEmail } from '../entities/failed-email.entity';

@Injectable()
export class FailedEmailRepository extends AbstractRepository<FailedEmail> {
  protected readonly logger = new Logger(FailedEmailRepository.name);

  constructor(
    @InjectModel(FailedEmail.name)
    protected readonly model: Model<FailedEmail>,
  ) {
    super(model);
  }
}
