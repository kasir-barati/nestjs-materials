export interface AuthConfig {
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
}
export interface GraphqlContext {
  user: string;
}
export interface UserContext {
  req: GraphqlContext;
}
export interface UserInfo {
  id: string;
  email: string;
}
export type JwtPayload = {
  sub: string;
} & Omit<UserInfo, 'id'>;
