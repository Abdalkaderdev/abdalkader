const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');
const dts = require('rollup-plugin-dts').default;
const { readFileSync } = require('fs');

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const isProduction = process.env.NODE_ENV === 'production';

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: !isProduction,
        exports: 'named',
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: !isProduction,
      },
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false, // We'll handle declarations separately
        exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.spec.tsx', '**/test/**/*'],
        compilerOptions: {
          jsx: 'react-jsx',
          declaration: false,
          emitDeclarationOnly: false,
        },
      }),
      postcss({
        extract: 'styles.css',
        minimize: isProduction,
        sourceMap: !isProduction,
        modules: false,
        inject: false,
        plugins: [],
      }),
    ],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [
      dts({
        tsconfig: './tsconfig.json',
        compilerOptions: {
          preserveSymlinks: false,
          incremental: false,
          declarationMap: false,
        },
      }),
    ],
    external: [/\.css$/],
  },
];