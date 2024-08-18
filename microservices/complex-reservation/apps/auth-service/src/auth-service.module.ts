import {
  databaseConfig,
  DatabaseModule,
  LoggerModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import authServiceConfig from './auth-service.config';
import { JwtModuleConfig } from './jwt-module.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'auth-service', '.env'),
      ],
      load: [databaseConfig, authServiceConfig],
      isGlobal: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authServiceConfig)],
      useClass: JwtModuleConfig,
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthModule {}
