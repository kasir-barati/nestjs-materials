import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    displayName: 'backend/libs/common',
    preset: '../../jest.preset.js',
    coverageDirectory: '../../coverage/backend/libs/common',
    moduleFileExtensions: ['js', 'json', 'ts'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
};

export default config;
