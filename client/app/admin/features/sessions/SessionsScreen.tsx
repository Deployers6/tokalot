"use client";

import { CalendarIcon, Info, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { BookingsModal } from "./BookingsModal";
import { CalendarPicker } from "./CalendarPicker";
import { CancelledSessionDialog } from "./CancelledSessionDialog";
import { CreateSessionForm } from "./CreateSessionForm";
import { EditSessionForm } from "./EditSessionForm";
import { SessionCard } from "./SessionCard";
import { SessionSheet } from "./SessionSheet";
import { useAdminSessions } from "./useAdminSessions";
import type { Section } from "./types";

export default function SessionsScreen() {
  const sessions = useAdminSessions();
  const [showCalendar, setShowCalendar] = useState(false);
  const [sheet, setSheet] = useState<null | { kind: "create" } | { kind: "edit"; section: Section }>(null);
  const [bookingsSection, setBookingsSection] = useState<Section | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sheet) setTimeout(() => setVisible(true), 10);
  }, [sheet]);

  const closeSheet = () => {
    setVisible(false);
    setTimeout(() => setSheet(null), 300);
  };

  return (
    <AdminShell eyebrow="Schedule" title="Sessions">
      <div className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">
        <button onClick={() => setShowCalendar(true)} className="inline-flex items-center gap-2 rounded-full bg-[#e0f8ff] px-4 py-2 text-xs font-bold text-[#006688]">
          <CalendarIcon className="h-4 w-4" />
          {sessions.selectedDate}
        </button>
        <div className="flex items-start gap-2 rounded-2xl border border-[#a8e6fa] bg-[#e0f8ff] px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#006688]" />
          <p className="text-[10px] font-medium leading-relaxed text-[#006688]"><span className="font-black uppercase">Auto-Cancel:</span> Sessions with under 3 participants 48h before start will be closed.</p>
        </div>
        <div className="flex items-center justify-between">
          <div><h2 className="text-3xl font-black text-slate-950">Session Schedule</h2><p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Daily List</p></div>
          <button onClick={() => setSheet({ kind: "create" })} className="rounded-2xl bg-[#20BEF9] p-3 text-white shadow-lg"><Plus className="h-6 w-6" /></button>
        </div>
      </div>
      <div className="space-y-3 px-5 pb-8 lg:px-8">
        {sessions.loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
            <Loader2 className="h-7 w-7 animate-spin text-[#20BEF9]" />
            <p className="text-sm font-bold">Loading sessions...</p>
          </div>
        ) : null}
        {!sessions.loading && !sessions.filteredSections.length ? <div className="py-20 text-center text-xs font-black uppercase tracking-[0.24em] text-slate-300">No sessions found</div> : null}
        {!sessions.loading ? sessions.filteredSections.map((section) => <SessionCard key={section.id} section={section} onEdit={() => setSheet({ kind: "edit", section })} onViewBookings={() => setBookingsSection(section)} />) : null}
      </div>
      {showCalendar ? <CalendarPicker selectedDate={sessions.selectedDate} activeDates={sessions.activeDates} onSelect={(date) => { sessions.setSelectedDate(date); setShowCalendar(false); }} onClose={() => setShowCalendar(false)} /> : null}
      {bookingsSection ? <BookingsModal section={bookingsSection} adminId={sessions.userId} onClose={() => setBookingsSection(null)} /> : null}
      {sheet ? <SessionSheet visible={visible} onClose={closeSheet}>{sheet.kind === "create" ? <CreateSessionForm key={sessions.selectedDate} teachers={sessions.teachers} defaultDate={sessions.selectedDate} onClose={closeSheet} onSuccess={(publishedDate) => { sessions.setSelectedDate(publishedDate); closeSheet(); void sessions.refresh({ reset: true }); }} /> : sheet.section.status ? <EditSessionForm section={sheet.section} teachers={sessions.teachers} onClose={closeSheet} onSuccess={async () => { await sessions.refresh(); closeSheet(); }} /> : <CancelledSessionDialog section={sheet.section} onClose={closeSheet} onSuccess={async () => { await sessions.refresh(); closeSheet(); }} />}</SessionSheet> : null}
    </AdminShell>
  );
}
