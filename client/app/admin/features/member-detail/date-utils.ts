import type { MembershipStatus } from "./types";

export function normalizeStatus(status?: string): MembershipStatus {
  if (status === "ACTIVE") return "ACTIVE";
  if (status === "EXPIRED") return "EXPIRED";
  return "PENDING";
}

export function toLocalDateString(date: Date | null) {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatPeriod(start: Date | null, end: Date | null) {
  if (!start && !end) return "Tap to set period";
  const format = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  if (start && end) return `${format(start)} - ${format(end)}`;
  if (start) return `From ${format(start)}`;
  return "—";
}

export function isSameDay(left: Date, right: Date) {
  return left.toDateString() === right.toDateString();
}

export function isBetween(date: Date, start: Date, end: Date) {
  return date > start && date < end;
}
