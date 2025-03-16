module.exports = {
    coverageReporters: ['lcov', 'text', 'text-summary'],
    setupFilesAfterEnv: ['jest-sinon'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    // TODO: use tsconfig.json paths
    moduleNameMapper: {
        '^/backend/libs/env(|/.*)$':
            '<rootDir>/apps/backend/libs/env/src/$1',
        '^/backend/libs/health(|/.*)$':
            '<rootDir>/apps/backend/libs/health/src/$1',
        '^/backend/libs/logging(|/.*)$':
            '<rootDir>/apps/backend/libs/logging/src/$1',
        '^/backend/libs/messaging(|/.*)$':
            '<rootDir>/apps/backend/libs/messaging/src/$1',
        '^/backend/libs/push(|/.*)$':
            '<rootDir>/apps/backend/libs/push/src/$1',
        '^/backend/libs/subscription(|/.*)$':
            '<rootDir>/apps/backend/libs/subscription/src/$1',
        '^/backend/libs/testing(|/.*)$':
            '<rootDir>/apps/backend/libs/testing/src/$1',
        '^/backend/libs/common(|/.*)$':
            '<rootDir>/apps/backend/libs/common/src/$1',
    },
};
