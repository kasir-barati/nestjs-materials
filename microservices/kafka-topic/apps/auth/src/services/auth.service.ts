import { Injectable } from '@nestjs/common';
import { CreateOrUpdateUserDto } from '../dto/create-or-update-user.dto';
import { CreateOrUpdateUserReturnType } from '../types/auth-service.type';
import { UserRepository } from '../user.repository';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async createOrUpdateUser({
    id,
    requestId,
    createOrUpdateUserDto,
  }: {
    id: string;
    requestId: string;
    createOrUpdateUserDto: CreateOrUpdateUserDto;
  }): Promise<CreateOrUpdateUserReturnType> {
    const user = await this.userRepository.findOne({ _id: id });

    if (user) {
      const updatedUser = await this.userService.updateUser({
        id,
        user,
        requestId,
        createOrUpdateUserDto,
      });

      return { status: 'updated', data: updatedUser };
    }

    const createdUser = await this.userService.createUser({
      id,
      requestId,
      createOrUpdateUserDto,
    });

    return { status: 'created', data: createdUser };
  }
}
