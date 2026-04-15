import type { DayOption } from "./types";

const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const monthLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function toFullDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDays(baseDate: Date, total = 30): DayOption[] {
  return Array.from({ length: total }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index);
    return { label: dayLabels[date.getDay()], date: date.getDate(), fullDate: toFullDate(date), month: date.getMonth(), year: date.getFullYear() };
  });
}

export function formatSessionTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Ulaanbaatar" });
}
