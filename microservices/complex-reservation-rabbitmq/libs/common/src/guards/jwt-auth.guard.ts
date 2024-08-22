import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {
  AUTH_SERVICE,
  MESSAGE_PATTERN_FOR_AUTHENTICATION_FLOW,
} from '../constants/services.constant';
import { AttachedUserToTheRequest } from '../types/attached-user-to-the-request.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest()
      .cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<AttachedUserToTheRequest>(
        MESSAGE_PATTERN_FOR_AUTHENTICATION_FLOW,
        {
          Authentication: jwt,
        },
      )
      .pipe(
        tap((response) => {
          // Here is where MicroservicesPayload.user is assigned.
          context.switchToHttp().getRequest().user = response;
        }),
        map(() => true),
        catchError(() => {
          // Write some more logic to handle different errors...
          return of(false);
        }),
      );
  }
}
