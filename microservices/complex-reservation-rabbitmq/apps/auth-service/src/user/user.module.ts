import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { User, UserSchema } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserSerializer } from './user.serializer';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { schema: UserSchema, name: User.name },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserSerializer],
  exports: [UserService],
})
export class UserModule {}
