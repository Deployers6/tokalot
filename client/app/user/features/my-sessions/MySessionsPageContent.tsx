"use client";

import { BookMarked, Info } from "lucide-react";
import { CenteredLoader } from "../../components/CenteredLoader";
import { UserShell } from "../../components/UserShell";
import { UserBrandHeader } from "../../components/UserBrandHeader";
import { BookingCard } from "./BookingCard";
import { MySessionTabs } from "./MySessionTabs";
import { useMySessions } from "./useMySessions";

export default function MySessionsPageContent() {
  const sessions = useMySessions();

  return (
    <UserShell header={<UserBrandHeader />} navTab="sessions">
      <div className="px-6 pt-6">
        <p className="text-xs font-bold text-slate-400">MEMBER DASHBOARD</p>
        <h2 className="mt-1 text-3xl font-black text-black">My Sessions</h2>
        <MySessionTabs activeTab={sessions.activeTab} onChange={sessions.setActiveTab} />
        {sessions.cancelMsg ? <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-600">{sessions.cancelMsg}</div> : null}
        <div className="mt-4 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3"><Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" /><div><p className="text-xs font-bold text-sky-700">Cancellation Policy</p><p className="mt-0.5 text-xs leading-relaxed text-slate-600">Sessions can only be cancelled up to 48 hours before their scheduled start time.</p></div></div>
        <div className="mt-4 flex flex-col gap-3">
          {sessions.loading ? <CenteredLoader label="Loading sessions..." /> : null}
          {!sessions.loading && !sessions.bookings.length ? <div className="mt-8 flex flex-col items-center gap-2"><BookMarked className="h-8 w-8 text-slate-200" /><p className="text-sm font-semibold text-slate-400">No sessions found</p></div> : null}
          {sessions.bookings.map((booking) => <BookingCard key={booking.id} booking={booking} activeTab={sessions.activeTab} cancelling={sessions.cancellingId === booking.id} now={sessions.now} onCancel={() => sessions.cancel(booking)} />)}
        </div>
      </div>
    </UserShell>
  );
}
