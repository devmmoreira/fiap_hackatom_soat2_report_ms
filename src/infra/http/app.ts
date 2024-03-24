import 'reflect-metadata';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { ErrorHandling } from './errorHandling';
import fastifyJwt from '@fastify/jwt';
import { env } from '@config/env';

import '@container/index';
import { appRoutes } from './routes';

export const app = fastify();

app.register(cors, {
  allowedHeaders: '*',
  origin: '*',
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1d',
  },
});

app.register(appRoutes);

app.setErrorHandler(ErrorHandling);
