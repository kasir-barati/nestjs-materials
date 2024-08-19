import { DuplicationError } from '@app/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await hash(password);
    const user = await this.userRepository
      .create({
        ...rest,
        password: hashedPassword,
      })
      .catch((error) => {
        if (error instanceof DuplicationError) {
          throw new BadRequestException(error.message);
        }
        throw error;
      });

    return user._id.toString();
  }

  findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }
}
