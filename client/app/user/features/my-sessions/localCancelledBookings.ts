import type { UserBooking } from "./types";

export function saveCancelledBooking(userId: string, booking: UserBooking) {
  const key = `cancelled_bookings_${userId}`;
  const existing = readCancelledBookings(userId);
  if (!existing.find((item) => item.id === booking.id)) {
    localStorage.setItem(key, JSON.stringify([{ ...booking, cancelledAt: new Date().toISOString() }, ...existing]));
  }
}

export function readCancelledBookings(userId: string) {
  const raw = localStorage.getItem(`cancelled_bookings_${userId}`) || "[]";
  return JSON.parse(raw) as UserBooking[];
}
