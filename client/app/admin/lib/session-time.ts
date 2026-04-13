const TIMEZONE = "Asia/Ulaanbaatar";

/**
 * ISO string-ийг "10:00 AM" гэх мэт цаг болгоно (Ulaanbaatar timezone)
 */
export function formatSessionTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: TIMEZONE,
  });
}

/**
 * ISO string-ийг date input-д тохирох "YYYY-MM-DD" формат болгоно (Ulaanbaatar timezone)
 */
export function getSessionDateInputValue(iso: string): string {
  const date = new Date(iso);
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TIMEZONE,
  }).format(date);
  // en-CA нь "YYYY-MM-DD" формат гаргана
  return parts;
}

/**
 * ISO string-ийг time input-д тохирох "HH:MM" формат болгоно (Ulaanbaatar timezone)
 */
export function getSessionTimeInputValue(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIMEZONE,
  }).format(date);
}

/**
 * Өнөөдрийн огноог "YYYY-MM-DD" форматаар буцаана (Ulaanbaatar timezone)
 */
export function getSessionToday(): string {
  return getSessionDateInputValue(new Date().toISOString());
}

/**
 * "YYYY-MM-DD" + "HH:MM" → ISO string (Ulaanbaatar timezone-оос UTC руу хөрвүүлнэ)
 * Ulaanbaatar = UTC+8
 */
export function toSessionISOString(date: string, time: string): string {
  // "2026-04-13" + "10:00" → Ulaanbaatar цаг гэж үзэж UTC руу хөрвүүлнэ
  const localDateTimeStr = `${date}T${time}:00`;
  // Ulaanbaatar UTC+8, тиймээс 8 цаг хасна
  const UB_OFFSET_MS = 8 * 60 * 60 * 1000;
  const localMs = new Date(localDateTimeStr).getTime();
  // new Date("YYYY-MM-DDTHH:MM:SS") нь local browser timezone-оор parse хийдэг тул
  // бид үүнийг Ulaanbaatar гэж тооцоод UTC руу гараараа хөрвүүлнэ
  const utcMs = localMs - UB_OFFSET_MS;
  return new Date(utcMs).toISOString();
}
