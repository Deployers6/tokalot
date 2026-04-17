// "use client";

// import { useUser } from "@clerk/nextjs";
// import { useEffect, useMemo, useState } from "react";
// import { bookSession, fetchMyBookings, fetchSessions } from "@/lib/api";
// import { getDays, toFullDate } from "./dashboard-utils";
// import type { SessionSlot } from "./types";

// export function useDashboardSessions() {
//   const { user } = useUser();
//   const days = useMemo(() => getDays(new Date(), 30), []);
//   const [activeDay, setActiveDay] = useState(toFullDate(new Date()));
//   const [sessions, setSessions] = useState<SessionSlot[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
//   const [bookingId, setBookingId] = useState<string | null>(null);
//   const [confirmId, setConfirmId] = useState<string | null>(null);

//   useEffect(() => {
//     if (!user?.id) return;
//     fetchMyBookings("upcoming")
//       .then((bookings: Array<{ section?: { id?: string } }>) => {
//         setBookedIds(
//           new Set(
//             bookings
//               .map((booking) => booking.section?.id)
//               .filter(Boolean) as string[],
//           ),
//         );
//       })
//       .catch(() => undefined);
//   }, [user?.id]);

//   useEffect(() => {
//     setLoading(true);
//     fetchSessions(activeDay)
//       .then((data) => {
//         const now = new Date();
//         const today = toFullDate(now);
//         const filtered =
//           activeDay === today
//             ? data.filter(
//                 (session: SessionSlot) => new Date(session.StartTime) > now,
//               )
//             : data;
//         setSessions(filtered);
//       })
//       .catch(() => setSessions([]))
//       .finally(() => setLoading(false));
//   }, [activeDay]);

//   return {
//     days,
//     activeDay,
//     setActiveDay,
//     sessions,
//     loading,
//     bookedIds,
//     bookingId,
//     confirmId,
//     setConfirmId,
//     completeBooking: async () => {
//       if (!user?.id || !confirmId) return;
//       setBookingId(confirmId);
//       setConfirmId(null);
//       try {
//         await bookSession(confirmId);
//         setBookedIds((current) => new Set(current).add(confirmId));
//       } finally {
//         setBookingId(null);
//       }
//     },
//   };
// }

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
  const [rawSessions, setRawSessions] = useState<SessionSlot[]>([]); // Serverees irsen bvh datag hadgalna
  const [loading, setLoading] = useState(false);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // My Bookings tatah
  useEffect(() => {
    if (!user?.id) return;
    fetchMyBookings("upcoming")
      .then((bookings: Array<{ section?: { id?: string } }>) => {
        setBookedIds(
          new Set(
            bookings
              .map((booking) => booking.section?.id)
              .filter(Boolean) as string[],
          ),
        );
      })
      .catch(() => undefined);
  }, [user?.id]);

  // Sessions tatah
  useEffect(() => {
    setLoading(true);
    fetchSessions(activeDay)
      .then((data) => setRawSessions(data))
      .catch(() => setRawSessions([]))
      .finally(() => setLoading(false));
  }, [activeDay]);

  /**
   * DATA FILTER LOGIC:
   * End slot ni duursen hicheeliig shvvej baina.
   */
  const sessions = useMemo(() => {
    const now = new Date();
    const today = toFullDate(now);

    return rawSessions.filter((session) => {
      // 1. Hervee user uuruu ene hicheeliig zakhialsan bol haragdsaar baina (Scheduled tuluvtei)
      if (bookedIds.has(session.id)) return true;

      // 2. Tsag ni ungursun bol hasna
      const isPast = activeDay === today && new Date(session.StartTime) <= now;
      if (isPast) return false;

      // 3. Slot ni duursen bol hasna
      const bookingCount = session.bookings?.length ?? 0;
      const isFull =
        session.capacity != null && bookingCount >= session.capacity;

      return !isFull;
    });
  }, [rawSessions, bookedIds, activeDay]);

  return {
    days,
    activeDay,
    setActiveDay,
    sessions, // Shvltvvr orson sessions-iig butsaana
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
        // Zakhialga amjilttai bolbol bookedIds-iig shinechilne
        setBookedIds((current) => new Set(current).add(confirmId));
      } finally {
        setBookingId(null);
      }
    },
  };
}
