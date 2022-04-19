module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],

  parserOptions: {
    project: ['./tsconfig.json'],
  },

  env: {
    node: true,
    browser: true,
    'jest/globals': true,
  },

  rules: {
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    complexity: ['warn', 10],
    'max-lines': ['warn', 300],
    'max-params': ['warn', 5],
    eqeqeq: ['error', 'smart'],
    'no-var': 'error',
    'prefer-const': 'error',
    'object-shorthand': 'error',
  },
};
