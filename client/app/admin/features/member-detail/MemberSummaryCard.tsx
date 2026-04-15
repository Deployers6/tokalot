import { UserRound } from "lucide-react";
import type { MembershipStatus } from "./types";

export function MemberSummaryCard({
  fullName,
  status,
}: {
  fullName: string;
  status: MembershipStatus;
}) {
  return (
    <section className="flex flex-col items-center rounded-[2rem] border border-slate-100 bg-white px-6 py-8 shadow-sm">
      <div className="flex h-[100px] w-[100px] items-center justify-center rounded-[40px] border-4 border-white bg-slate-100 shadow-sm">
        <UserRound className="h-[60px] w-[60px] text-slate-300" />
      </div>
      <h2 className="mt-4 text-2xl font-black text-slate-900">{fullName || "Student"}</h2>
      {status === "EXPIRED" ? <span className="mt-3 rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Membership Expired</span> : null}
    </section>
  );
}
