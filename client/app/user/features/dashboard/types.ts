export interface SessionSlot {
  id: string;
  title: string;
  level: string;
  StartTime: string;
  endTime: string;
  capacity: number;
  bookings: Array<unknown>;
}

export interface DayOption {
  label: string;
  date: number;
  fullDate: string;
  month: number;
  year: number;
}
