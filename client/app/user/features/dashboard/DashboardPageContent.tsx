"use client";

import { CalendarDays } from "lucide-react";
import { CenteredLoader } from "../../components/CenteredLoader";
import { UserShell } from "../../components/UserShell";
import { UserBrandHeader } from "../../components/UserBrandHeader";
import { DaySelector } from "./DaySelector";
import { BookingSheet } from "./BookingSheet";
import { monthLabels } from "./dashboard-utils";
import { SessionSlotCard } from "./SessionSlotCard";
import { useDashboardSessions } from "./useDashboardSessions";

export default function DashboardPageContent() {
  const dashboard = useDashboardSessions();
  const activeDay = dashboard.days.find((day) => day.fullDate === dashboard.activeDay) ?? dashboard.days[0];

  return (
    <UserShell header={<UserBrandHeader />} navTab="schedule">
      <div className="px-6 pt-6">
        <p className="text-xs font-bold tracking-widest text-slate-400">BOOK YOUR SESSION</p>
        <h2 className="mt-1 text-4xl font-black text-black">{monthLabels[activeDay.month]} {activeDay.year}</h2>
        <DaySelector days={dashboard.days} activeDay={dashboard.activeDay} onSelect={dashboard.setActiveDay} />
        {!dashboard.loading ? <div className="mt-6 flex items-center justify-between"><p className="text-base font-bold text-black">Available Slots</p><p className="text-xs text-slate-400">{dashboard.sessions.length} sessions found</p></div> : null}
        <div className="mt-3 flex flex-col gap-3">
          {dashboard.loading ? <CenteredLoader label="Loading sessions..." /> : null}
          {!dashboard.loading && !dashboard.sessions.length ? <div className="mt-10 flex flex-col items-center gap-2"><CalendarDays className="h-9 w-9 text-slate-200" /><p className="text-sm font-semibold text-slate-400">No sessions available today</p></div> : null}
          {dashboard.sessions.map((session) => <SessionSlotCard key={session.id} session={session} booked={dashboard.bookedIds.has(session.id)} booking={dashboard.bookingId === session.id} onBook={() => dashboard.setConfirmId(session.id)} />)}
        </div>
      </div>
      <BookingSheet open={Boolean(dashboard.confirmId)} onConfirm={dashboard.completeBooking} onClose={() => dashboard.setConfirmId(null)} />
    </UserShell>
  );
}
