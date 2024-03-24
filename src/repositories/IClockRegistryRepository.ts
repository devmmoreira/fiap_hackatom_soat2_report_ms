import { IEmployeeReportDTO } from '@dtos/IEmployeeReportDTO';
import { IClockRegistry } from '@models/IClockRegistry';

export interface IClockRegistryRepository {
  getMonthlyEmployeeRegistries(data: IEmployeeReportDTO): Promise<Omit<IClockRegistry, 'user'>[]>;
}
