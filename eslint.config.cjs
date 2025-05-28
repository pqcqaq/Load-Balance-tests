// eslint.config.cjs
const parser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');

/** @type {import('eslint').FlatConfig[]} */
module.exports = [
  // 忽略构建目录和依赖
  {
    ignores: ['dist/**', 'node_modules/**', 'tests/**'],
  },
  // 针对所有 TypeScript 文件的配置
  {
    files: ['*.ts', '**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      // 删除 import/extensions 规则，Node ESM 直接 .js 就可以
      // 'import/extensions': ['error', 'ignorePackages', { ts: 'never', js: 'never' }],
      'no-unused-vars': 'warn',
    },
    settings: {
      'import/resolver': {
        // 使用 eslint-import-resolver-typescript
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];
