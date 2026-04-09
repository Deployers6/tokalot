export const SESSION_TIMEZONE = "Asia/Ulaanbaatar";
export const SESSION_UTC_OFFSET = "+08:00";

const MS_PER_HOUR = 60 * 60 * 1000;

export function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * MS_PER_HOUR);
}

export function getSessionDayRange(date: string) {
  return {
    start: new Date(`${date}T00:00:00.000${SESSION_UTC_OFFSET}`),
    end: new Date(`${date}T23:59:59.999${SESSION_UTC_OFFSET}`),
  };
}
