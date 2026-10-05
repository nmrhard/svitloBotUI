import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/', '.astro/', '.netlify/', 'node_modules/', 'public/'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
