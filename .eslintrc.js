module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },

  extends: ["eslint:recommended", "plugin:jest/recommended"],

  env: {
    node: true,
    browser: true,
    "jest/globals": true,
  },

  rules: {
    "complexity": ["warn", 10],
    "max-lines": ["warn", 300],
    "max-params": ["warn", 5],
    "eqeqeq": ["error", "smart"],
    "no-var": "error",
    "prefer-const": "error",
    "object-shorthand": "error",
  },
};
