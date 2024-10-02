import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected logger = new Logger(UserRepository.name);

  constructor(@InjectModel(User.name) model: Model<User>) {
    super(model);
  }

  async findOne(filter: RootFilterQuery<User>) {
    const user = await this.model.findOne(filter);

    if (!user) {
      return;
    }

    return user.toObject();
  }
}
