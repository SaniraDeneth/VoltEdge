import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export const nextRules = [
   {
      files: ['client/**/*.ts', 'client/**/*.tsx'],
      plugins: {
         '@next/next': nextPlugin,
      },
      rules: {
         ...nextPlugin.configs.recommended.rules,
         ...nextPlugin.configs['core-web-vitals'].rules,
      },
      languageOptions: {
         parserOptions: {
            project: './client/tsconfig.json',
         },
      },
      settings: {
         next: {
            rootDir: 'client/',
         },
      },
   },
];

export default tseslint.config(
   eslint.configs.recommended,
   ...tseslint.configs.recommended,
   ...nextRules
);
