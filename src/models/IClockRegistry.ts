export const ClockRegistryCategory = {
  START_PERIOD: 'start_period',
  START_LUNCH: 'start_lunch',
  END_LUNCH: 'end_lunch',
  END_PERIOD: 'end_period',
} as const;

export type IClockRegistryCategory = (typeof ClockRegistryCategory)[keyof typeof ClockRegistryCategory];

export interface IClockRegistry {
  id: string;
  category: IClockRegistryCategory;
  is_business_day: boolean;
  marked_at: Date;
  created_at: Date;
  updated_at: Date;
}
