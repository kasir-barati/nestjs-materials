import {
  DatabaseModule,
  LoggerModule,
  MessagingModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import authConfig from './configs/auth.config';
import { DatabaseConfig } from './configs/database.config';
import { User, UserSchema } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'auth', '.env'),
      ],
      load: [authConfig],
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule.forRootAsync({
      useClass: DatabaseConfig,
      imports: [ConfigModule.forFeature(authConfig)],
    }),
    DatabaseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    LoggerModule,
    MessagingModule.forRoot({
      module: 'auth',
      application: 'auth',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    AuthSerializer,
    UserRepository,
  ],
})
export class AuthModule {}
