export const SESSION_TIMEZONE = "Asia/Ulaanbaatar";
export const SESSION_UTC_OFFSET = "+08:00";

function getDateParts(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SESSION_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});
}

export function formatSessionDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SESSION_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatSessionTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: SESSION_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function getSessionDateInputValue(value: Date | string) {
  const parts = getDateParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getSessionTimeInputValue(iso: string) {
  const parts = getDateParts(iso);
  return `${parts.hour}:${parts.minute}`;
}

export function getSessionToday() {
  return getSessionDateInputValue(new Date());
}

export function toSessionISOString(date: string, time: string) {
  return `${date}T${time}:00${SESSION_UTC_OFFSET}`;
}

export function addDaysToSessionDate(date: string, days: number) {
  const baseDate = new Date(`${date}T00:00:00${SESSION_UTC_OFFSET}`);
  const shifted = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
  return getSessionDateInputValue(shifted);
}

export function getSessionCalendarMeta(date: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SESSION_TIMEZONE,
    weekday: "short",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).formatToParts(new Date(`${date}T00:00:00${SESSION_UTC_OFFSET}`));

  const values = parts.reduce<Record<string, string>>((acc, part) => {
    if (part.type !== "literal") {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return {
    label: values.weekday.toUpperCase(),
    date: Number(values.day),
    month: Number(values.month) - 1,
    year: Number(values.year),
  };
}
