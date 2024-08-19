import { User } from '@app/common';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { DateTime } from 'luxon';
import authServiceConfig from './configs/auth-service.config';
import { UserService } from './user/user.service';

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly userService: UserService,
    @Inject(authServiceConfig.KEY)
    private readonly authServiceConfigs: ConfigType<
      typeof authServiceConfig
    >,
    private readonly jwtService: JwtService,
  ) {}

  async validateLogin(
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.userService
      .findByEmail(email)
      .catch((error) => {
        if (error instanceof NotFoundException) {
          throw new UnauthorizedException(
            'Username or password is not valid',
          );
        }
        throw error;
      });

    const isPasswordCorrect = await verify(user.password, password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        'Username or password is not valid',
      );
    }

    return {
      _id: user._id.toString(),
      email: user.email,
    };
  }

  async login(user: User, response: Response) {
    const payload = {
      sub: user._id,
      email: user.email,
    };
    const expires = this.generateExpires();
    const token = await this.jwtService.signAsync(payload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  private generateExpires() {
    const expirationUnit =
      this.authServiceConfigs.JWT_EXPIRATION.charAt(
        this.authServiceConfigs.JWT_EXPIRATION.length - 1,
      );
    const expirationNumber =
      this.authServiceConfigs.JWT_EXPIRATION.slice(
        0,
        this.authServiceConfigs.JWT_EXPIRATION.length - 1,
      );
    const expires = DateTime.now();

    switch (expirationUnit) {
      case 'h':
        expires.plus({ hours: Number(expirationNumber) });
        break;
      case 'm':
        expires.plus({ minutes: Number(expirationNumber) });
        break;
      case 's':
        expires.plus({ seconds: Number(expirationNumber) });
        break;
    }

    return expires.toJSDate();
  }
}
