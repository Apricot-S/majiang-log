import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: './src/index.ts',
    dts: true,
    sourcemap: true,
  },
  {
    entry: './src/command.ts',
    dts: false,
    minify: true,
    banner: '#!/usr/bin/env node',
  },
  {
    entry: './src/server.ts',
    dts: false,
    minify: true,
  },
]);
