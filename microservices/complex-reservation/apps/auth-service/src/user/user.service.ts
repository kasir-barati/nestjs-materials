import { DuplicationError, getTempUser } from '@app/common';
import {
  BadRequestException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(private readonly userRepository: UserRepository) {}

  onModuleInit() {
    const defaultTempUserForTestPurposes = getTempUser();
    this.create({
      email: defaultTempUserForTestPurposes.email,
      password: defaultTempUserForTestPurposes.password,
    });
  }

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
