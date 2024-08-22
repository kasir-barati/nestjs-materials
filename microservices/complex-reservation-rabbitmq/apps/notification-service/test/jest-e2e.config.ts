import type { Config } from 'jest';
import { join } from 'path';

const appCommonPath = join(
  __dirname,
  '..',
  '..',
  '..',
  'libs',
  'common',
  'src$1',
);

export default {
  displayName: 'notification-service e2e tests',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.e2e-spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@app/common(.*)$': appCommonPath,
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  detectOpenHandles: true,
  openHandlesTimeout: 5000,
  forceExit: true,
} satisfies Config;
