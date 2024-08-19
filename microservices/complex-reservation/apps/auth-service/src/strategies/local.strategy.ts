import { User } from '@app/common';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthServiceService } from '../auth-service.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authServiceService: AuthServiceService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  validate(email: string, password: string): Promise<User> {
    return this.authServiceService.validateLogin(email, password);
  }
}
