export interface AuthServiceConfig {
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  SWAGGER_PATH: string;
  AUTH_SERVICE_PORT: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
