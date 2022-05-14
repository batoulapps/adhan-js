import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts'];

export default {
  input: 'src/Adhan.ts',
  output: [
    {
      file: 'lib/bundles/adhan.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'lib/bundles/adhan.esm.min.js',
      format: 'esm',
      plugins: [terser()],
      sourcemap: true,
    },
    {
      file: 'lib/bundles/adhan.umd.js',
      format: 'umd',
      name: 'adhan',
      sourcemap: true,
    },
    {
      file: 'lib/bundles/adhan.umd.min.js',
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
      include: ['src/**/*.ts'],
    }),
  ],
};
