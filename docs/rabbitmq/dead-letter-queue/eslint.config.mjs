// @ts-check

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import perfectionist from 'eslint-plugin-perfectionist';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/.eslintrc.js',
      '**/protobuf/*.interface.ts',
      '**/er_proto/*',
      './src/common/grpc/common.interface.ts',
    ],
  },
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  importPlugin.flatConfigs.recommended,
  {
    rules: {
      'import/no-duplicates': ['error', { considerQueryString: true }],
      'import/no-unresolved': ['off'],
      'import/named': ['off'],
      'no-console': ['error'],
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
      jest: pluginJest,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-disabled-tests': 'error',
    },
  },
  {
    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      perfectionist,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
      },
    },

    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-named-imports': 'error',
      'perfectionist/sort-exports': 'error',
    },
  },
  {
    ignores: ['*decorator.ts', '*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/**/*.config.ts'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];
