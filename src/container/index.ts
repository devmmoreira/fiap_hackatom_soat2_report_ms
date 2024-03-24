import { ClockRegistryRepository } from '@infra/prisma/repositories/ClockRegistryRepository';
import { MailProvider } from '@providers/MailProviders';
import { IClockRegistryRepository } from 'repositories/IClockRegistryRepository';
import { container } from 'tsyringe';

container.registerSingleton<IClockRegistryRepository>('ClockRegistryRepository', ClockRegistryRepository);
container.registerSingleton<MailProvider>('MailProvider', MailProvider);
