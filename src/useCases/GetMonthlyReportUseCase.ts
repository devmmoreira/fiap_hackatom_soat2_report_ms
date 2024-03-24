import { inject, injectable } from 'tsyringe';
import { IClockRegistryRepository } from 'repositories/IClockRegistryRepository';
import AppError from '@errors/AppError';
import { getMonthNumber } from '@utils/getMonthNumber';
import dayjs from 'dayjs';
import { createPDF } from '@utils/createPdf';
import { getWeekDay } from '@utils/getWeekDay';
import { getDateTimeInfo } from '@utils/getDateTimeInfo';
import { sumHours } from '@utils/sumHours';
import { diffHours } from '@utils/diffHours';
import { MailProvider } from '@providers/MailProviders';
import { IUser } from '@models/IUser';

interface IRequest {
  month: 'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' | 'august' | 'september' | 'october' | 'november' | 'december';
  year: number;
  user: IUser;
}

interface ProcessRegistry {
  day: number;
  date: string;
  weekDay: string;
  start_period?: string;
  start_lunch?: string;
  end_lunch?: string;
  end_period?: string;
}

@injectable()
export class GetMonthlyReportUseCase {
  constructor(
    @inject('ClockRegistryRepository')
    private clockRegistryRepository: IClockRegistryRepository,

    @inject('MailProvider')
    private mailProvider: MailProvider,
  ) {}

  async execute({ month, year, user }: IRequest): Promise<void> {
    const currentDate = dayjs().toDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const selectedMonth = getMonthNumber(month);

    if (selectedMonth === null) {
      throw new AppError('Invalid month informed', 400);
    }

    const selectedPeriod = dayjs(`${year}-${selectedMonth + 1}-05`);

    if (year > currentYear) {
      throw new AppError('This year is not closed and is still open', 400);
    }

    if (year === currentYear) {
      if (selectedMonth >= currentMonth) {
        throw new AppError('This month is not closed and is still open', 400);
      }
    }

    const registries = await this.clockRegistryRepository.getMonthlyEmployeeRegistries({
      month: selectedMonth,
      year: year,
      userId: user.id,
    });

    const { registriesToReport, totalHours } = registries.reduce(
      (accumulator, registry, index, originalArray) => {
        const currentDay = dayjs(registry.marked_at).get('date');

        const existWithThisDay = accumulator.registriesToReport.find((item) => item.day === currentDay);

        if (existWithThisDay) {
          return accumulator;
        }

        const registriesOfCurrentDay = originalArray.filter((item) => {
          const itemDay = dayjs(item.marked_at).get('date');

          return currentDay === itemDay;
        });

        const parsedRegistry = registriesOfCurrentDay.reduce((regitryAccumulator, currentInfo) => {
          regitryAccumulator.day = currentDay;
          regitryAccumulator.weekDay = getWeekDay(dayjs(currentInfo.marked_at).day());

          regitryAccumulator.date = new Date(currentInfo.marked_at).toLocaleDateString('pt-br', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          switch (currentInfo.category) {
            case 'start_period':
              regitryAccumulator.start_period = getDateTimeInfo(currentInfo.marked_at);
              break;
            case 'start_lunch':
              regitryAccumulator.start_lunch = getDateTimeInfo(currentInfo.marked_at);
              break;
            case 'end_lunch':
              regitryAccumulator.end_lunch = getDateTimeInfo(currentInfo.marked_at);
              break;
            case 'end_period':
              regitryAccumulator.end_period = getDateTimeInfo(currentInfo.marked_at);
              break;
            default:
              break;
          }

          return regitryAccumulator;
        }, {} as ProcessRegistry);

        const totalStartPeriod = diffHours(parsedRegistry.start_lunch, parsedRegistry.start_period);
        const totalEndPeriod = diffHours(parsedRegistry.end_period, parsedRegistry.end_lunch);
        const sumTotal = sumHours(totalStartPeriod, totalEndPeriod);

        accumulator.totalHours = sumHours(accumulator.totalHours, sumTotal);
        accumulator.registriesToReport.push(parsedRegistry);

        return accumulator;
      },
      {
        totalHours: '00:00',
        registriesToReport: [] as ProcessRegistry[],
      },
    );

    const startPeriod = selectedPeriod.startOf('month').toDate().toLocaleDateString('pt-br', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const endPeriod = selectedPeriod.endOf('month').toDate().toLocaleDateString('pt-br', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    const reportBuffer = await createPDF({
      template: 'user-registers-report',
      data: {
        registries: registriesToReport,
        total_hours: totalHours,
        startPeriod,
        endPeriod,
        employee: {
          name: user.name,
          pib: user.pib,
          document: user.cpf,
          role: user.job_role,
          total_hours: 22,
        },
      },
    });

    this.mailProvider.sendMail({
      to: user.email,
      subject: `Espelho de ponto ${startPeriod} até ${endPeriod}`,
      template: 'marks-report',
      variablesHtml: {
        currentYear: currentDate.getFullYear(),
        username: user.name,
      },
      attachments: [
        {
          filename: 'Relatório mensal espelho de ponto.pdf',
          content: reportBuffer,
          contentType: 'application/pdf',
          encoding: 'utf-8',
        },
      ],
    });
  }
}
