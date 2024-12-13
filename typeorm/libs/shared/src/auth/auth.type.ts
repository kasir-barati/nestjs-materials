export interface AuthConfig {
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
}
export interface GraphqlContext {
  req: {
    user: string;
  };
}
export interface UserInfo {
  id: string;
  email: string;
}
export type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
} & Omit<UserInfo, 'id'>;
