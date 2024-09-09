import { Injectable } from "@nestjs/common";
import { CreateUserRequestDto } from "./dto";
import { UserDocument } from "./entities/user.entity";
import { UserRepository } from "./user-repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    createUserRequestDto?: CreateUserRequestDto
  ): Promise<UserDocument> {
    return this.userRepository.userModel.create({
      email: "kasir.barati@gmail.com",
      password: "123",
      username: "kasir",
    });
  }
}
