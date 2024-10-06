import type { Config } from 'jest';
import { join } from 'path';

const libRootDir = join('<rootDir>', 'libs');
const appRootDir = join('<rootDir>', 'apps');
const appCommon = join(libRootDir, 'common', 'src/$1');
const appTesting = join(libRootDir, 'testing', 'src/$1');

export default {
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  roots: [libRootDir, appRootDir],
  moduleNameMapper: {
    '^@app/common(|/.*)$': appCommon,
    '^@app/testing(|/.*)$': appTesting,
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
} satisfies Config;