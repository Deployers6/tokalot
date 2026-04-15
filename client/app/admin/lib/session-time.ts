const TIMEZONE = "Asia/Ulaanbaatar";

export function formatSessionTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: TIMEZONE,
  });
}

export function getSessionDateInputValue(iso: string): string {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIMEZONE,
  }).format(date);

  return parts;
}

export function getSessionTimeInputValue(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIMEZONE,
  }).format(date);
}

export function getSessionToday(): string {
  return getSessionDateInputValue(new Date().toISOString());
}

export function toSessionISOString(date: string, time: string): string {
  const localDateTimeStr = `${date}T${time}:00`;

  const UB_OFFSET_MS = 8 * 60 * 60 * 1000;
  const localMs = new Date(localDateTimeStr).getTime();

  const utcMs = localMs - UB_OFFSET_MS;
  return new Date(utcMs).toISOString();
}
