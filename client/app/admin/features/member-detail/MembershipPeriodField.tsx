import { Pencil } from "lucide-react";

export function MembershipPeriodField({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</label>
      <button onClick={onClick} className="flex h-[70px] w-full items-center gap-4 rounded-2xl bg-[#efefef] px-5 text-left">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">📅</div>
        <span className="flex-1 truncate font-black text-slate-800">{value}</span>
        <Pencil className="h-4 w-4 text-slate-400" />
      </button>
    </div>
  );
}
