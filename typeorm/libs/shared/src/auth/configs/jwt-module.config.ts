import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import authConfig from './auth.config';

export class JwtModuleConfig implements JwtOptionsFactory {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfigs: ConfigType<typeof authConfig>,
  ) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    Logger.log('JWT module configured', 'NestApplication');

    return {
      secret: this.authConfigs.JWT_SECRET,
      signOptions: {
        expiresIn: this.authConfigs.JWT_EXPIRATION,
      },
    };
  }
}
