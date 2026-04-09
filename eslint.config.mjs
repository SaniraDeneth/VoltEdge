import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
   eslint.configs.recommended,
   ...tseslint.configs.recommended,
   eslintConfigPrettier, // Must be last to override formatting conflicts
   {
      ignores: ['**/node_modules/', '**/dist/'],
   },
   {
      files: ['server/src/**/*.ts'],
      languageOptions: {
         parserOptions: {
            project: './server/tsconfig.json',
         },
      },
      rules: {
         // You can add custom rules here later!
         // Example: '@typescript-eslint/no-explicit-any': 'error'
      },
   }
);
