import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.type';
import authConfig from '../configs/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfigs: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return (
            request?.cookies?.Authentication ??
            request?.['Authentication']
          );
        },
      ]),
      secretOrKey: authConfigs.JWT_SECRET,
    });
  }

  /**@returns User ID */
  async validate(payload: JwtPayload): Promise<string> {
    // Do whatever needed!
    return payload.sub;
  }
}
