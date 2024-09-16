import { NodeEnv } from '../../types/app.type';
import { getLevel } from './level.util';

describe('getLevel', () => {
  it("should return 'debug'", () => {
    process.env.NODE_ENV = NodeEnv.development;

    const level = getLevel();

    expect(level).toBe('debug');
  });
  it("should return 'info'", () => {
    process.env.NODE_ENV = NodeEnv.production;

    const level = getLevel();

    expect(level).toBe('info');
  });
});
