"use client";

import { Calendar, Pencil, Ticket, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AdminMember } from "../../features/members/types";

const STATUS_BADGE: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  ACTIVE: { label: "ACTIVE", bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  PENDING: { label: "PENDING", bg: "bg-yellow-50", text: "text-yellow-600", dot: "bg-yellow-500" },
  EXPIRED: { label: "EXPIRED", bg: "bg-red-50", text: "text-red-500", dot: "bg-red-500" },
  NO_MEMBERSHIP: { label: "NO MEMBERSHIP", bg: "bg-gray-50", text: "text-gray-400", dot: "bg-gray-300" },
};

export default function UserCard({ user }: { user: AdminMember }) {
  const router = useRouter();
  const status = user.membershipStatus ?? "NO_MEMBERSHIP";
  const badge = STATUS_BADGE[status] ?? STATUS_BADGE.NO_MEMBERSHIP;

  return (
    <article onClick={() => router.push(`/admin/members/${user.clerkId}`)} className="group flex cursor-pointer items-center justify-between rounded-[28px] border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative">
          <div className="flex h-[55px] w-[55px] items-center justify-center rounded-[20px] border-2 border-white bg-[#f1f5f9] shadow-inner"><UserRound className="h-6 w-6 text-slate-400" /></div>
          <div className={`absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white ${badge.dot}`} />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-[15px] font-black tracking-tight text-slate-900">{user.fullName}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-lg border border-current/10 px-2.5 py-1 text-[9px] font-black tracking-[0.16em] ${badge.bg} ${badge.text}`}>{badge.label}</span>
            {typeof user.remainingSessions === "number" && status !== "NO_MEMBERSHIP" ? <span className={`flex items-center gap-1 text-[11px] font-bold ${user.remainingSessions === 0 ? "text-red-400" : "text-slate-500"}`}><Ticket className={`h-3 w-3 ${user.remainingSessions === 0 ? "text-red-400" : "text-[#20BEF9]"}`} />{user.remainingSessions} left</span> : null}
          </div>
          {user.membershipEnd ? <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400"><Calendar className="h-3 w-3" />Until {new Date(user.membershipEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p> : null}
        </div>
      </div>
      <div className="ml-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1f5f9] transition-colors group-hover:bg-[#20BEF9] group-hover:text-white">
        <Pencil className="h-4 w-4" />
      </div>
    </article>
  );
}
