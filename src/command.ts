#!/usr/bin/env node

import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { convertLog, MODE } from './lib/convertLog.js';

const options = {
  mode: {
    type: 'string',
    short: 'm',
    multiple: false,
    default: MODE.Log,
  },
} as const;

const main = async () => {
  const args = process.argv.slice(2);
  const parsedArgs = parseArgs({ options, args });
  const mode = parsedArgs.values.mode!;

  const input = fs.readFileSync(process.stdin.fd, 'utf-8');
  const parsedInput = JSON.parse(input);

  const outputJson = convertLog(parsedInput, mode);

  const output = Array.isArray(outputJson)
    ? outputJson.join('\n') + '\n'
    : JSON.stringify(outputJson) + '\n';
  fs.writeSync(process.stdout.fd, output);
};

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
