import { includeIgnoreFile } from '@eslint/compat';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import { fileURLToPath } from 'node:url';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default [
  // Global ignores
  {
    ignores: [
      '.pnp.cjs',
      '.pnp.loader.mjs',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.vscode/**',
      '*.log',
      '.env'
    ],
  },

  // Include .gitignore patterns
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),

  // Base configuration for all JS/JSX files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
        alias: {
          map: [['@', 'src']],
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      // 'import/no-relative-parent-imports': 'error',
      // 'import/no-restricted-paths': ['error', {
      //   zones: [{
      //     target: './src', from: './src', except: ['./*', './**/*'],
      //   },],
      // },],
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'off',       // not needed in React 17+
      'react/react-in-jsx-scope': 'off',   // React 17+ doesn't need import React
      'no-unused-vars': ['error', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
      }],
      'react/jsx-uses-vars': 'error',
      // Formatting rules that align with Prettier
      'eol-last': ['error', 'always'], // require exactly one newline at EOF
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }], // no multiple empty lines, no empty lines at end/beginning
      'no-trailing-spaces': 'error', // no trailing whitespace
      'no-undef': 'error',

      // Additional formatting rules
      quotes: ['error', 'single', { avoidEscape: true }], // single quotes
      semi: ['error', 'always'], // require semicolons
    },
  },
];
