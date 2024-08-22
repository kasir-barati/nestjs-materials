export interface AuthServiceConfig {
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  SWAGGER_PATH: string;
  TCP_PORT: number;
  AUTH_SERVICE_PORT: number;
  DATABASE_URL: string;
  MONGO_INITDB_DATABASE: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
