#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import Fastify, { FastifyInstance } from 'fastify';
import { convertLog, MODE } from './lib/convertLog.js';
import { MAJIANG_LOG_SCHEMA } from './lib/schema.js';

const options = {
  port: {
    type: 'string',
    short: 'p',
    multiple: false,
    default: '8001',
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
  const server = Fastify({
    logger: true,
  }).withTypeProvider<JsonSchemaToTsProvider>();

  const schema = { body: MAJIANG_LOG_SCHEMA };
  const opts = { schema };

  server.post(`${baseurl}${MODE.Log}`, opts, async (request, reply) => {
    const data = request.body;
    const output = convertLog(data, MODE.Log);
    reply.header('Content-Type', 'application/json').code(200).send(output);
  });

  server.post(`${baseurl}${MODE.Viewer}`, opts, async (request, reply) => {
    const data = request.body;
    const output = convertLog(data, MODE.Viewer);
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
    console.log(`Server listening at ${address}`);
  });

  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });
};

const main = () => {
  const options = getOptions();
  const server = createServer(options.baseurl);
  startServer(server, options.port);
};

main();
