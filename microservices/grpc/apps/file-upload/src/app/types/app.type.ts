export interface AppConfig {
  NODE_ENV: 'development' | 'test' | 'production';
  OBJECT_STORAGE_REGION: string;
  OBJECT_STORAGE_ACCESS_KEY: string;
  OBJECT_STORAGE_SECRET_KEY: string;
  OBJECT_STORAGE_ENDPOINT?: string;
}
