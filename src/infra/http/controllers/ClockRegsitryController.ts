import { IUser } from '@models/IUser';
import { GetMonthlyReportUseCase } from '@useCases/GetMonthlyReportUseCase';
import { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { z } from 'zod';

const handleReportParams = z.object({
  month: z.enum(['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']),
  year: z.coerce.number(),
});

export const ClockRegsitryController = {
  async userReport(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user;

    const { month, year } = handleReportParams.parse(request.body);

    const getMonthlyReportUseCase = container.resolve(GetMonthlyReportUseCase);

    await getMonthlyReportUseCase.execute({
      user: user as IUser,
      month,
      year,
    });

    return reply.status(204).send();
  },
};
