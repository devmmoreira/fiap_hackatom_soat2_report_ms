import AppError from '@errors/AppError';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export const ErrorHandling = (error: any, request: FastifyRequest, reply: FastifyReply) => {
  console.log(error);
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  });
};
