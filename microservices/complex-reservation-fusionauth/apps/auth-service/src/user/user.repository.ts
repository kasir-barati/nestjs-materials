import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name)
    protected readonly model: Model<User>,
  ) {
    super(model);
  }
}
