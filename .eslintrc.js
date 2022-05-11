module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2018,
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:prettier/recommended',
  ],

  overrides: [
    {
      files: ['*.js'],
      parser: null,
      parserOptions: { project: null },
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
      },
    },
  ],

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

  plugins: ['@typescript-eslint', 'jest'],
};
