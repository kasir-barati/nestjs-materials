import { NodeEnv } from '../types/node-env.type';

export function isTestEnv(nodeEnv: NodeEnv): Boolean {
  if (nodeEnv === NodeEnv.test) {
    return true;
  }
}
