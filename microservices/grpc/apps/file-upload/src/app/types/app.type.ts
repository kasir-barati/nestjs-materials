export interface AppConfig {
  NODE_ENV: 'development' | 'test' | 'production';
  REGION: string;
  ACCESS_KEY: string;
  SECRET_KEY: string;
}
