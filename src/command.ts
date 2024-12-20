#!/usr/bin/env node

import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { convertLog } from './lib/convertLog.js';
import { MODE } from './lib/mode.js';

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
    ? `${outputJson.join('\n')}\n` // For viewer
    : `${JSON.stringify(outputJson)}\n`; // For log
  fs.writeSync(process.stdout.fd, output);
};

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
