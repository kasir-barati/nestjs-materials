import { Injectable } from '@nestjs/common';
import { MeDto } from './dto/response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserSerializer {
  serializeMe(user: User): MeDto {
    return {
      _id: user._id.toString(),
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
