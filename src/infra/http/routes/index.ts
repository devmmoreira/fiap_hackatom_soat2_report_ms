import { FastifyInstance } from 'fastify';
import { clockRegistryRoutes } from './clockRegistry.routes';

export async function appRoutes(app: FastifyInstance) {
  app.register(clockRegistryRoutes);
}
