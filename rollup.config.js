import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js'];

export default {
  input: 'src/Adhan.js',
  output: [
    {
      file: 'lib/bundles/bundle.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'lib/bundles/bundle.esm.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'lib/bundles/bundle.umd.js',
      format: 'umd',
      name: 'adhan',
      sourcemap: true,
    },
    {
      file: 'lib/bundles/bundle.umd.min.js',
      format: 'umd',
      name: 'adhan',
      plugins: [terser()],
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ extensions }),
    babel({
      babelHelpers: 'bundled',
      exclude: './node_modules/**',
      extensions,
      include: ['src/**/*.js'],
    }),
  ],
};
