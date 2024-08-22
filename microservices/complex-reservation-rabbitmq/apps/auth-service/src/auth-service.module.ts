import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import authServiceConfig from './configs/auth-service.config';
import { DatabaseConfig } from './configs/database.config';
import { JwtModuleConfig } from './configs/jwt-module.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule.forRootAsync({
      imports: [ConfigModule.forFeature(authServiceConfig)],
      useClass: DatabaseConfig,
    }),
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), '.env'),
        join(process.cwd(), 'apps', 'auth-service', '.env'),
      ],
      load: [authServiceConfig],
      isGlobal: true,
      cache: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authServiceConfig)],
      useClass: JwtModuleConfig,
    }),
    UserModule,
  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
