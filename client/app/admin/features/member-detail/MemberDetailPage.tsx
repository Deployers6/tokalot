"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { AdminShell } from "../../components/layout/AdminShell";
import { DateRangePicker } from "./DateRangePicker";
import { formatPeriod } from "./date-utils";
import { MemberSummaryCard } from "./MemberSummaryCard";
import { MembershipHistoryList } from "./MembershipHistoryList";
import { MembershipPeriodField } from "./MembershipPeriodField";
import { MembershipStatusField } from "./MembershipStatusField";
import { SessionCreditsEditor } from "./SessionCreditsEditor";
import { useAdminMemberDetail } from "./useAdminMemberDetail";

export default function MemberDetailPage() {
  const detail = useAdminMemberDetail();
  const [showCalendar, setShowCalendar] = useState(false);
  const saveLabel = detail.saving ? "Saving..." : "Save Changes";
  const saveAction = (
    <button
      onClick={() => detail.save()}
      disabled={detail.saving}
      className="rounded-2xl bg-black px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white disabled:opacity-50"
    >
      {saveLabel}
    </button>
  );
  const mobileSaveAction = (
    <button
      onClick={() => detail.save()}
      disabled={detail.saving}
      className="rounded-full border border-[#20BEF9]/40 bg-[#20BEF9]/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#20BEF9] disabled:opacity-50"
    >
      {detail.saving ? "Saving" : "Save"}
    </button>
  );

  return (
    <AdminShell
      backHref="/admin/members"
      backLabel="Members"
      mobileTitle="Edit Student"
      eyebrow="Member Profile"
      title="Edit Student"
      actions={saveAction}
      mobileHeaderActions={mobileSaveAction}
      mobileNav={false}
    >
      <div className="mx-auto max-w-3xl space-y-6 px-5 py-6 lg:px-8">
        <MemberSummaryCard fullName={detail.fullName} status={detail.membershipStatus} />
        <label className="block space-y-2 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Name</span><input value={detail.fullName} onChange={(event) => detail.setFullName(event.target.value)} className="w-full bg-transparent text-lg font-black text-slate-800 outline-none" placeholder="Name" /></label>
        <div className="grid gap-6 lg:grid-cols-2">
          <MembershipStatusField value={detail.membershipStatus} onChange={detail.setMembershipStatus} onDeleteMembership={async () => { if (confirm("Are you sure you want to delete this membership?")) await detail.deleteMembership(); }} />
          <MembershipPeriodField label="Period" value={formatPeriod(detail.membershipStart, detail.membershipEnd)} onClick={() => setShowCalendar(true)} />
        </div>
        <SessionCreditsEditor used={detail.sessionUsed} total={detail.sessionTotal} onChange={detail.setSessionCredits} />
        <MembershipHistoryList history={detail.membership?.history || []} />
        <button onClick={async () => { if (confirm("Are you sure?")) await detail.deleteUser(); }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-4 text-xs font-black uppercase tracking-[0.2em] text-red-500"><Trash2 className="h-4 w-4" />Delete Entire Profile</button>
      </div>
      {showCalendar ? <DateRangePicker startDate={detail.membershipStart} endDate={detail.membershipEnd} onChange={detail.setMembershipRange} onClose={() => setShowCalendar(false)} /> : null}
    </AdminShell>
  );
}
