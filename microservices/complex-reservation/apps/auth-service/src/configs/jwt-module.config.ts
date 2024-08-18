import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import authServiceConfig from './auth-service.config';

export class JwtModuleConfig implements JwtOptionsFactory {
  constructor(
    @Inject(authServiceConfig.KEY)
    private readonly authServiceConfigs: ConfigType<
      typeof authServiceConfig
    >,
  ) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    Logger.log('JWT module configured', 'NestApplication');

    return {
      secret: this.authServiceConfigs.JWT_SECRET,
      signOptions: {
        expiresIn: this.authServiceConfigs.JWT_EXPIRATION,
      },
    };
  }
}
