import { JwtService } from '@nestjs/jwt';
import { SinonMock, SinonMockType } from 'testing';
import { JwtPayload, UserInfo } from '../auth.type';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: SinonMockType<JwtService>;

  beforeEach(async () => {
    jwtService = SinonMock.of(JwtService);
    service = new AuthService(jwtService);
  });

  it('should generate JWT tokens', async () => {
    // Arrange
    const userInfo: UserInfo = {
      email: 'me@me.com',
      id: '9c844e28-4e3f-4e8f-819d-e9347102eef6',
    };
    const payload: JwtPayload = {
      sub: userInfo.id,
      email: userInfo.email,
    };
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5Yzg0NGUyOC00ZTNmLTRlOGYtODE5ZC1lOTM0NzEwMmVlZjYiLCJlbWFpbCI6Im1lQG1lLmNvbSJ9.TFpijJsyCjVYgI3t0J-_ZyHBbBZHmupNAkFsxpBalTw';
    jwtService.signAsync.withArgs(payload).resolves(accessToken);

    // Act
    const result = await service.getJwtTokens(userInfo);

    // Assert
    expect(result).toStrictEqual({
      accessToken,
    });
  });
});
