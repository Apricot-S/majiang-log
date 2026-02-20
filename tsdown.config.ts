import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: './src/index.ts',
    fixedExtension: false,
    inlineOnly: false,
    dts: true,
    sourcemap: true,
  },
  {
    entry: './src/command.ts',
    fixedExtension: false,
    inlineOnly: false,
    dts: false,
    minify: true,
    noExternal: ['ajv'],
  },
  {
    entry: './src/server.ts',
    fixedExtension: false,
    inlineOnly: false,
    dts: false,
    minify: true,
    noExternal: ['ajv', 'fastify'],
  },
]);
