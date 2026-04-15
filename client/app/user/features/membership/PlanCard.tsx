import type { MembershipPlan } from "./plans";

export function PlanCard({
  plan,
}: {
  plan: MembershipPlan;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <h2 className="text-lg font-black text-black">{plan.label}</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${plan.badgeColor}`}>{plan.badge}</span>
      </div>
      <div className="flex flex-col divide-y divide-slate-100">
        {plan.options.map((option, index) => (
          <div key={`${plan.id}-${index}`} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3"><div className="h-8 w-1 rounded-full bg-slate-200" /><div><p className="text-sm font-bold text-black">{option.months}</p><p className="text-xs text-slate-400">{option.subtitle}</p></div></div>
            <div className="text-right"><p className="text-base font-black text-black">{option.price}</p>{option.note ? <p className="text-[10px] font-bold uppercase text-slate-400">{option.note}</p> : null}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
