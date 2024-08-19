import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await hash(password);
    const user = await this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });

    return user._id.toString();
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
