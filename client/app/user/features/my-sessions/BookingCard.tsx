import { CalendarDays, CheckCircle2, Clock, Lock } from "lucide-react";
import type { UserBooking } from "./types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(value: string) {
  const date = new Date(value);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Ulaanbaatar" });
}

interface BookingCardProps {
  booking: UserBooking;
  activeTab: "upcoming" | "history";
  cancelling: boolean;
  now: number;
  onCancel: () => void;
}

export function BookingCard({ booking, activeTab, cancelling, now, onCancel }: BookingCardProps) {
  const isCancelled = booking.status === false;
  const hoursLeft = (new Date(booking.section.StartTime).getTime() - now) / (1000 * 60 * 60);
  const isLocked = !isCancelled && activeTab === "upcoming" && hoursLeft > 0 && hoursLeft < 48;
  const cancellable = !isCancelled && activeTab === "upcoming" && hoursLeft >= 48;
  const isCompleted = activeTab === "history" && !isCancelled;
  const borderColor = isCancelled ? "#f87171" : isLocked ? "#38bdf8" : cancellable ? "#0BC917" : "#38bdf8";

  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm" style={activeTab === "upcoming" || isCancelled ? { borderLeft: `4px solid ${borderColor}` } : undefined}>
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            {isCancelled ? <p className="mb-1 text-[10px] font-bold text-red-400">CANCELLED</p> : null}
            {cancellable ? <p className="mb-1 text-[10px] font-bold text-green-500">SCHEDULED</p> : null}
            <p className="text-sm font-bold text-black">{booking.section.title}</p>
            <p className="mt-0.5 text-xs text-slate-400">{booking.section.level}</p>
          </div>
          {cancellable ? <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-green-500" /> : null}
          {isLocked ? <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /> : null}
        </div>
        <div className="flex flex-col gap-1 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-[13px] w-[13px]" />
              {formatDate(booking.section.StartTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-[13px] w-[13px]" />
              {formatTime(booking.section.StartTime)} - {formatTime(booking.section.endTime)}
            </span>
          </div>
          {isCancelled && (booking.cancelledAt || booking.updatedAt) ? <p className="text-[11px] font-medium text-red-400">Cancelled: {new Date(booking.cancelledAt || booking.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p> : null}
        </div>
        {isLocked ? <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-400"><Lock className="h-[13px] w-[13px]" />CANCELLATION LOCKED</div> : null}
        {cancellable ? <button onClick={onCancel} disabled={cancelling} className="w-full rounded-lg border border-red-300 py-2.5 text-xs font-bold text-red-500 disabled:opacity-50">{cancelling ? "Cancelling..." : "CANCEL SESSION"}</button> : null}
        {isCompleted ? <div className="flex items-center justify-center rounded-lg bg-slate-100 py-2.5 text-xs font-bold text-slate-400">COMPLETED</div> : null}
      </div>
    </article>
  );
}
