import { PencilIcon, User, Users } from "lucide-react";
import { formatSessionTime } from "@/app/admin/lib/session-time";
import type { Section } from "./types";

interface SessionCardProps {
  section: Section;
  onEdit: () => void;
  onViewBookings: () => void;
}

export function SessionCard({ section, onEdit, onViewBookings }: SessionCardProps) {
  const activeBookings = (section.bookings || []).filter((booking) => booking.status).length;
  const totalBookings = (section.bookings || []).length;
  const cancelled = !section.status;
  const accent = cancelled ? "#fca5a5" : activeBookings >= section.capacity ? "#f59e0b" : "#20BEF9";

  return (
    <article className="rounded-2xl border-l-4 bg-white p-4 shadow-sm" style={{ borderLeftColor: accent }}>
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#20BEF9]">
        {formatSessionTime(section.StartTime)} - {formatSessionTime(section.endTime)}
      </p>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className={`text-lg font-black ${cancelled ? "text-slate-300" : "text-slate-800"}`}>{section.title}</h3>
          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500">
            <User className="h-3 w-3" />
            {section.teacher?.fullName || "—"}
          </p>
        </div>
        <button onClick={onEdit} className="rounded-xl bg-slate-50 p-2 text-slate-400">
          <PencilIcon className="h-4 w-4" />
        </button>
      </div>
      <button onClick={onViewBookings} className="mt-3 flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#20BEF9]">
        <Users className="h-3 w-3" />
        {activeBookings}/{section.capacity} bookings
        {totalBookings > activeBookings ? <span className="text-[10px] text-slate-400">({totalBookings - activeBookings} cancelled)</span> : null}
      </button>
    </article>
  );
}
