import { CheckCircle2, Clock } from "lucide-react";
import { formatSessionTime } from "./dashboard-utils";
import type { SessionSlot } from "./types";

export function SessionSlotCard({
  session,
  booked,
  booking,
  onBook,
}: {
  session: SessionSlot;
  booked: boolean;
  booking: boolean;
  onBook: () => void;
}) {
  if (booked) {
    return (
      <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm" style={{ borderLeft: "4px solid #0BC917" }}>
        <div className="flex flex-col gap-3 px-4 py-4"><div className="flex items-start justify-between gap-2"><div><p className="mb-1 text-[10px] font-bold text-green-500">SCHEDULED</p><p className="text-sm font-bold text-black">{session.title}</p><p className="mt-0.5 text-xs text-slate-400">{session.level}</p></div><CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-green-500" /></div><div className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="h-[13px] w-[13px]" /><span>{formatSessionTime(session.StartTime)} - {formatSessionTime(session.endTime)}</span></div></div>
      </article>
    );
  }

  return (
    <article className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold text-sky-500">{formatSessionTime(session.StartTime)} - {formatSessionTime(session.endTime)}</p>
        <p className="text-sm font-bold text-black">{session.title}</p>
        <p className="text-xs text-slate-400">{session.level}</p>
      </div>
      <button onClick={onBook} disabled={booking} className="ml-3 shrink-0 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-60">{booking ? "..." : "Book Now"}</button>
    </article>
  );
}
