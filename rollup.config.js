import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

import { readFile } from 'node:fs/promises';
const pkg = JSON.parse(await readFile('./package.json'));

export default [
  {
    input: 'src/index.ts',
    output: {
      file: './dist/index.js',
      format: 'es',
      sourcemap: 'inline',
    },
    external: [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.devDependencies),
    ],
    plugins: [typescript()],
  },
  {
    input: 'src/command.ts',
    output: {
      file: 'dist/command.js',
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ declaration: false }),
      terser(),
      json(),
    ],
  },
  {
    input: 'src/server.ts',
    output: {
      file: 'dist/server.js',
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ declaration: false }),
      terser(),
      json(),
    ],
  },
];
