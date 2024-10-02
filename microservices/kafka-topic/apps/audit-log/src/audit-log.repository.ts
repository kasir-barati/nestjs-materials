import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './entities/log.entity';

@Injectable()
export class LogRepository extends AbstractRepository<Log> {
  protected logger = new Logger(LogRepository.name);

  constructor(@InjectModel(Log.name) model: Model<Log>) {
    super(model);
  }
}
