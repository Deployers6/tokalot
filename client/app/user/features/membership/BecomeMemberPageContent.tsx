"use client";

import { UserShell } from "../../components/UserShell";
import { UserBackHeader } from "../../components/UserBackHeader";
import { PaymentInstructions } from "./PaymentInstructions";
import { PlanCard } from "./PlanCard";
import { membershipPlans } from "./plans";
import { useMembershipRequest } from "./useMembershipRequest";

export default function BecomeMemberPageContent() {
  const membership = useMembershipRequest();

  return (
    <UserShell header={<UserBackHeader title="Become a Member" />}>
      <div className="flex flex-col gap-5 px-5 pt-5">
        {membershipPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        <PaymentInstructions />
      </div>
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white px-5 py-4">
        <button onClick={membership.send} disabled={membership.loading} className="w-full rounded-2xl bg-black py-4 text-sm font-bold text-white disabled:opacity-60">{membership.loading ? "Sending..." : "Send Membership Request"}</button>
        <p className="mt-2 text-center text-[10px] leading-relaxed text-slate-400">After sending your request, our team will review it within 24 hours.</p>
      </div>
    </UserShell>
  );
}
