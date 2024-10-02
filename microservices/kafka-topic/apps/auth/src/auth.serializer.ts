import { CreatedOrUpdatedUserDto } from './dto/created-or-updated-user.dto';
import { User } from './entities/user.entity';

export class AuthSerializer {
  toCreatedOrUpdatedUserDto(
    unserialized: User,
  ): CreatedOrUpdatedUserDto {
    return {
      _id: unserialized._id.toString(),
      email: unserialized.email,
    };
  }
}
