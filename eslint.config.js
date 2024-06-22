import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['**/dist/**/*', '**/node_modules/**/*'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2021,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];
