import type { Config } from 'jest';

export default {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '../src',
    testRegex: '.e2e-spec.ts$',
    transform: {
        '^.+\\.(t|j)s$': [
            'ts-jest',
            {
                tsconfig: './tsconfig.spec.json',
            },
        ],
    },
} satisfies Config;
