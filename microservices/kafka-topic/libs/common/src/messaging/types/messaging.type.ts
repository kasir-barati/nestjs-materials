import { NodeEnv } from '../../types/node-env.type';

export interface MessagingConfig {
  NODE_ENV: NodeEnv;
  MESSAGING_BROKER: string;
  MESSAGING_USERNAME: string;
  MESSAGING_PASSWORD: string;
}

export interface MessagingModuleOptions {
  application: string;
  module: string;
}
