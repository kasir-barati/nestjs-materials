# Configure its strategy

- Pass the request to validate method:
```ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

interface AccessTokenPayload {
  /**
     * @description usually userId
     */
    sub: number;
    /**
     * @description issued at
     */
    iat?: number;
    /**
     * @description expire at
     */
    ext?: number;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token-jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'authConfigs.accessTokenSecret',
            passReqToCallback: true,
        });
    }
    async validate(request: Request, payload: AccessTokenPayload): AccessTokenPayload {
        return payload;
    }
}
```
