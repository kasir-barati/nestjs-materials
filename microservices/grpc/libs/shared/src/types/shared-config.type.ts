export interface SharedConfig {
  PORT: number;
  NODE_ENV: NodeEnv;
  SWAGGER_PATH: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: NodeEnv;
    }
  }
}

// https://nextjs.org/docs/messages/non-standard-node-env
export enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}
