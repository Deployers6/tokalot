import { CalendarDays, Ticket } from "lucide-react";
import type { MembershipSummary } from "./types";

function formatDate(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    : "—";
}

export function MembershipCard({
  membership,
}: {
  membership: MembershipSummary | null | undefined;
}) {
  if (membership === undefined) {
    return <div className="rounded-[12px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-400">Loading...</div>;
  }

  if (membership === null) {
    return <div className="rounded-[12px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-400">No membership found</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <CardRow icon={<CalendarDays className="h-[18px] w-[18px] text-sky-500" />} title="Membership Period" value={`${formatDate(membership.startDate)} - ${formatDate(membership.endDate)}`} status={membership.status} />
      <div className="rounded-[12px] border border-slate-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50"><Ticket className="h-[18px] w-[18px] text-sky-500" /></div>
          <div><p className="text-[10px] font-bold uppercase text-slate-400">Session Credits</p><p className="text-sm font-bold text-slate-800">{membership.remainingSessions} / {membership.totalSessions} left</p></div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-sky-500" style={{ width: membership.totalSessions > 0 ? `${(membership.remainingSessions / membership.totalSessions) * 100}%` : "0%" }} /></div>
        <div className="mt-1 flex justify-between text-[10px] text-slate-400"><span>USED: {membership.usedSessions}</span><span>TOTAL: {membership.totalSessions}</span></div>
      </div>
    </div>
  );
}

function CardRow({ icon, title, value, status }: { icon: React.ReactNode; title: string; value: string; status: string }) {
  const tone = status === "ACTIVE" ? "bg-green-100 text-green-600" : status === "EXPIRED" ? "bg-red-100 text-red-500" : "bg-yellow-100 text-yellow-600";
  return <div className="flex items-center gap-3 rounded-[12px] border border-slate-200 bg-white px-4 py-4"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50">{icon}</div><div className="flex-1"><p className="text-[10px] font-bold uppercase text-slate-400">{title}</p><p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${tone}`}>{status}</span></div>;
}
