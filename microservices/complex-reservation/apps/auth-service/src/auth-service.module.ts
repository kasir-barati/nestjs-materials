import {
  databaseConfig,
  DatabaseModule,
  LoggerModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import authServiceConfig from './auth-service.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      load: [databaseConfig, authServiceConfig],
      isGlobal: true,
      cache: true,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
