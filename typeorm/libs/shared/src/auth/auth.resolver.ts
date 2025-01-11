import { Query, Resolver } from '@nestjs/graphql';
import { JwtToken } from './dto/jwt-token.dto';
import { AuthService } from './services/auth.service';

@Resolver(() => JwtToken)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => JwtToken)
  async login(): Promise<JwtToken> {
    return this.authService.getJwtTokens({
      email: 'test@test.com',
      id: 'ed803422-42db-49c1-bc59-c2e9acdc3aa4',
    });
  }
}
