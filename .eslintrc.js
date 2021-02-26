module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },

  env: {
    node: true,
    browser: true,
  },

  extends: ["eslint:recommended"],

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
