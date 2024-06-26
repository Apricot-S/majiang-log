#!/usr/bin/env node

import { parseArgs } from 'node:util';
import Fastify from 'fastify';
import { convertLog } from './lib/convertLog.js';

const options = {
  port: {
    type: 'string',
    short: 'p',
    multiple: false,
    default: '8081',
  },
  baseurl: {
    type: 'string',
    short: 'b',
    multiple: false,
    default: '/majiang-log/',
  },
} as const;

const args = process.argv.slice(2);
const parsedArgs = parseArgs({ options, args });

const port = parseInt(parsedArgs.values.port!);
const base =
  ('' + parsedArgs.values.baseurl)
    .replace(/^(?!\/.*)/, '/$&')
    .replace(/\/$/, '') + '/';

const server = Fastify({
  logger: true,
});

server.addHook('preHandler', async (request: any, reply: any) => {
  const contentType = request.headers['content-type'];
  if (contentType && contentType.toLowerCase().startsWith('application/json')) {
    return;
  } else {
    reply
      .code(400)
      .send({ error: 'Invalid content type. Expected application/json' });
    throw new Error('Invalid content type. Expected application/json');
  }
});

server.post(base, async (request: any, reply: any) => {
  const data = request.body;
  const output = convertLog(data, 'log');
  reply.header('Content-Type', 'application/json').code(200);
  reply.send(output);
});

server.listen({ port: port }, (error: any, address: any) => {
  if (error) {
    server.log.error(error);
    process.exit(1);
  }
  server.log.info(`Server listening on ${address}`);
});
