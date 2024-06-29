#!/usr/bin/env node

import { parseArgs } from 'node:util';
import Fastify, { FastifyInstance } from 'fastify';
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

type Options = {
  port: number;
  baseurl: string;
};

const getOptions = (): Options => {
  const args = process.argv.slice(2);
  const parsedArgs = parseArgs({ options, args });
  const port = parseInt(parsedArgs.values.port!);
  if (isNaN(port) || port < 1024 || port > 49151) {
    throw new Error('Invalid port number');
  }
  const baseurl =
    ('' + parsedArgs.values.baseurl)
      .replace(/^(?!\/.*)/, '/$&')
      .replace(/\/$/, '') + '/';
  return { port, baseurl };
};

const createServer = (baseurl: string): FastifyInstance => {
  const server = Fastify({ logger: true });

  server.addHook('preHandler', async (request, reply) => {
    const contentType = request.headers['content-type'];
    if (
      !contentType ||
      !contentType.toLowerCase().startsWith('application/json')
    ) {
      reply
        .code(400)
        .send({ error: 'Invalid content type. Expected application/json' });
      throw new Error('Invalid content type. Expected application/json');
    }
  });

  server.post(baseurl, async (request, reply) => {
    const data = request.body;
    const output = convertLog(data, 'log');
    reply.header('Content-Type', 'application/json').code(200).send(output);
  });

  return server;
};

const startServer = (server: FastifyInstance, port: number) => {
  server.listen({ port: port }, (error, address) => {
    if (error) {
      server.log.error(error);
      process.exit(1);
    }
    server.log.info(`Server listening on ${address}`);
  });
};

const main = () => {
  const options = getOptions();
  const server = createServer(options.baseurl);
  startServer(server, options.port);
};

main();
