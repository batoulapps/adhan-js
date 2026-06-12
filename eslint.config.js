import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1. Global Ignores (Replaces .eslintignore)
  {
    ignores: ['dist/**/*', 'lib/**/*', 'node_modules/**/*', 'coverage/**/*'],
  },

  // 2. Base ESLint Recommended Rules
  eslint.configs.recommended,

  // 3. Modern TypeScript Rules
  ...tseslint.configs.recommended,

  // 4. Your Custom Project Rules Overrides
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      // Add any specific custom rules you liked from your old .eslintrc here
    },
  },
  {
    files: ['*.cjs', '**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        process: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
);
