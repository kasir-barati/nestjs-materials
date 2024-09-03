import { NodeEnv } from '@app/common';

export function isTestEnv(nodeEnv: NodeEnv): Boolean {
  if (nodeEnv === NodeEnv.test) {
    return true;
  }
}
