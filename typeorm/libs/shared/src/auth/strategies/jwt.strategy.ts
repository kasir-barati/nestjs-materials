import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { headerNormalizer } from '../../utils/header-normalizer.util';
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
        (request: Request) => {
          const normalizedHeaders = headerNormalizer(request.headers);
          // No need to normalize cookies since they are case-sensitive
          // https://stackoverflow.com/a/11312272/8784518
          const authorizationInCookie =
            request?.cookies?.Authorization;
          const authorization =
            authorizationInCookie ??
            normalizedHeaders['authorization'];
          const token = authorization.split(' ')[1];

          return token;
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
