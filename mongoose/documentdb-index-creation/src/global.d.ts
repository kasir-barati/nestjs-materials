declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development' | 'test';
      DB_URI: string;
      PORT: number;
    }
  }
}

export {};
