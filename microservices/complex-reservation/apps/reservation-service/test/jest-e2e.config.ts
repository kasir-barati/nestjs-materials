import type { Config } from 'jest';

export default {
  displayName: 'reservation-service e2e tests',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.e2e-spec.ts'],
  // testMatch: [
  //   '**/reservation-service/test/e2e-tests/business/reservation.e2e-spec.ts',
  // ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  detectOpenHandles: true,
  openHandlesTimeout: 5000,
  forceExit: true,
} satisfies Config;
