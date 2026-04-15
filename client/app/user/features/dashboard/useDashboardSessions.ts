"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { bookSession, fetchMyBookings, fetchSessions } from "@/lib/api";
import { getDays, toFullDate } from "./dashboard-utils";
import type { SessionSlot } from "./types";

export function useDashboardSessions() {
  const { user } = useUser();
  const days = useMemo(() => getDays(new Date(), 30), []);
  const [activeDay, setActiveDay] = useState(toFullDate(new Date()));
  const [sessions, setSessions] = useState<SessionSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchMyBookings("upcoming")
      .then((bookings: Array<{ section?: { id?: string } }>) => {
        setBookedIds(new Set(bookings.map((booking) => booking.section?.id).filter(Boolean) as string[]));
      })
      .catch(() => undefined);
  }, [user?.id]);

  useEffect(() => {
    setLoading(true);
    fetchSessions(activeDay)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [activeDay]);

  return {
    days,
    activeDay,
    setActiveDay,
    sessions,
    loading,
    bookedIds,
    bookingId,
    confirmId,
    setConfirmId,
    completeBooking: async () => {
      if (!user?.id || !confirmId) return;
      setBookingId(confirmId);
      setConfirmId(null);
      try {
        await bookSession(confirmId);
        setBookedIds((current) => new Set(current).add(confirmId));
      } finally {
        setBookingId(null);
      }
    },
  };
}
