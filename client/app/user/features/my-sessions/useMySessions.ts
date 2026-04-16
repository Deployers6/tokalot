"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { cancelBooking, fetchMyBookings } from "@/lib/api";
import { readCancelledBookings, saveCancelledBooking } from "./localCancelledBookings";
import type { UserBooking } from "./types";

export function useMySessions() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelMsg, setCancelMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    setNow(Date.now());
    fetchMyBookings(activeTab === "upcoming" ? "upcoming" : "completed")
      .then((data: UserBooking[]) => {
        const cancelled = readCancelledBookings(user.id);
        const cancelledIds = new Set(cancelled.map((booking) => booking.id));
        setBookings(activeTab === "history" ? [...cancelled.filter((booking) => !data.find((item) => item.id === booking.id)), ...data] : data.filter((booking) => !cancelledIds.has(booking.id)));
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [activeTab, user?.id]);

  return {
    activeTab,
    setActiveTab,
    bookings,
    loading,
    now,
    cancellingId,
    cancelMsg,
    cancel: async (booking: UserBooking) => {
      if (!user?.id || !confirm("Are you sure you want to cancel this session?")) return;
      setCancellingId(booking.id);
      try {
        await cancelBooking(booking.id);
        saveCancelledBooking(user.id, booking);
        setCancelMsg("Session cancelled. 1 credit has been refunded.");
        setTimeout(() => setCancelMsg(null), 4000);
        setActiveTab("history");
      } finally {
        setCancellingId(null);
      }
    },
  };
}
