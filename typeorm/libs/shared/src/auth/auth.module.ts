import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import authConfig from './configs/auth.config';
import { JwtModuleConfig } from './configs/jwt-module.config';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      useClass: JwtModuleConfig,
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthService, AuthResolver],
  exports: [JwtStrategy, JwtModule, AuthService],
})
/**
 * @description
 * This module expects to access two env variables called: `JWT_SECRET` and `JWT_EXPIRATION`
 */
export class AuthModule {}
