// @ts-nocheck

/**
 * @readme Since here we needed to define NODE_ENV type and NextJS is also defining it I decided to disable tsc compile checks (look at the first line) for this file since it is a simple type declaration and an enum. We also ignored this file from being linted in the libs/shared/.eslintrc.json.
 *
 * @therefore DO NOT add extra or more logics here.
 */

declare global {
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
