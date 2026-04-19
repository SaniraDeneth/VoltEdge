import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import { nextRules } from './client/eslint.config.mjs';

export default tseslint.config(
   eslint.configs.recommended,
   ...tseslint.configs.recommended,
   {
      languageOptions: {
         parserOptions: {
            tsconfigRootDir: import.meta.dirname,
         },
      },
   },
   {
      ignores: ['**/node_modules/', '**/dist/', 'client/.next/'],
   },
   {
      files: ['server/src/**/*.ts'],
      languageOptions: {
         parserOptions: {
            project: './server/tsconfig.json',
            tsconfigRootDir: import.meta.dirname,
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
   eslintConfigPrettier 
);
