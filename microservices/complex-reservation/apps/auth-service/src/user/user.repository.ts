import { AbstractRepository } from '@app/common';
import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  async findByEmail(email: string): Promise<User> {
    const user = await this.model.findOne({ email });

    if (!user) {
      throw new NotFoundException(
        'Could not find user with ' + email,
      );
    }

    return user.toObject();
  }
}
