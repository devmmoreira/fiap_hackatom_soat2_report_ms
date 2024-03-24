import { IClockRegistry } from "@models/IClockRegistry";
import { prisma } from "@providers/prisma";
import dayjs from "dayjs";
import { IClockRegistryRepository } from "repositories/IClockRegistryRepository";
import { IEmployeeReportDTO } from "@dtos/IEmployeeReportDTO";

export class ClockRegistryRepository implements IClockRegistryRepository{    
    async getMonthlyEmployeeRegistries({ month, userId, year}: IEmployeeReportDTO): Promise<Omit<IClockRegistry, "user">[]> {
        const dateIn = dayjs(`${year}-${month + 1}-01`)
        const dateAt = dateIn.endOf('month')
        
        const registries = await prisma.clockRegistry.findMany({
            where: {
                user_id: userId,
                marked_at: {
                    gte: dateIn.toDate(),
                    lte: dateAt.toDate()
                }
            },
        })

        return registries as Omit<IClockRegistry, "user">[]
    }
}