export interface AppConfig {
  NODE_ENV: 'development' | 'test' | 'production';
  AWS_REGION: string;
  AWS_S3_ACCESS_KEY: string;
  AWS_S3_SECRET_KEY: string;
}
