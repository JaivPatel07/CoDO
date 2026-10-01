import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'node_modules']),

  // Browser application code
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['*.config.js', 'vite.config.js'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // `const { a, b, ...rest } = obj` intentionally drops a/b — that is the
      // idiomatic way to omit fields, so don't flag the discarded siblings.
      'no-unused-vars': ['error', {
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'all',
      }],
    },
  },

  // Build/config files run in Node, not the browser
  {
    files: ['*.config.js', 'vite.config.js', '.eslintrc.*'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },
])
