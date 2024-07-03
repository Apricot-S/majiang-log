#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import Fastify, { FastifyInstance } from 'fastify';
import { convertLog, isMode, Mode, MODE } from './lib/convertLog.js';
import { MAJIANG_LOG_SCHEMA } from './lib/schema.js';

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
  mode: {
    type: 'string',
    short: 'm',
    multiple: false,
    default: MODE.Log,
  },
} as const;

type Options = {
  port: number;
  baseurl: string;
  mode: Mode;
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

  const mode = parsedArgs.values.mode!;
  if (!isMode(mode)) {
    throw new Error(`Invalid mode: ${mode}`);
  }

  return { port, baseurl, mode };
};

const createServer = (baseurl: string, mode: Mode): FastifyInstance => {
  const server = Fastify({
    logger: true,
  }).withTypeProvider<JsonSchemaToTsProvider>();

  const schema = { body: MAJIANG_LOG_SCHEMA };
  server.post(baseurl, { schema }, async (request, reply) => {
    const data = request.body;
    const output = convertLog(data, mode);
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
  const server = createServer(options.baseurl, options.mode);
  startServer(server, options.port);
};

main();
