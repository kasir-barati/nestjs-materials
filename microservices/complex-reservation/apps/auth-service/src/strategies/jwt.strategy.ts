import { User } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthServiceService } from '../auth-service.service';
import { JwtPayload } from '../auth-service.type';
import authServiceConfig from '../configs/auth-service.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authServiceConfig.KEY)
    private readonly authServiceConfigs: ConfigType<
      typeof authServiceConfig
    >,
    private readonly authServiceService: AuthServiceService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: authServiceConfigs.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authServiceService.getUserForJwtStrategy(
      payload.sub,
    );

    return {
      _id: user._id.toString(),
      email: user.email,
    };
  }
}
