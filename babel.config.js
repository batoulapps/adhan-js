const sharedPresets = ['@babel/typescript'];
const shared = {
  ignore: ['src/**/*.spec.ts', 'src/**/*.spec.js'],
  presets: sharedPresets,
};

module.exports = {
  env: {
    esmUnbundled: shared,
    esmBundled: {
      ...shared,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead',
          },
        ],
        ...sharedPresets,
      ],
    },
    cjs: {
      ...shared,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
          },
        ],
        ...sharedPresets,
      ],
    },
    test: {
      presets: ['@babel/preset-env', ...sharedPresets],
    },
  },
};
