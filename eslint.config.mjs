import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { nextRules } from './client/eslint.config.mjs';

export default tseslint.config(
   eslint.configs.recommended,
   ...tseslint.configs.recommended,
   {
      ignores: ['**/node_modules/', '**/dist/', 'client/.next/'],
   },
   {
      files: ['server/src/**/*.ts'],
      languageOptions: {
         parserOptions: {
            project: './server/tsconfig.json',
         },
      },
      rules: {
         '@typescript-eslint/no-unused-vars': [
            'error',
            { 
               argsIgnorePattern: '^_',
               varsIgnorePattern: '^_',
            },
         ],
      },
   },
   ...nextRules,
   eslintConfigPrettier // Must be last to override formatting conflicts
);
