"use client";

import { ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { STATUS_CONFIG } from "./constants";
import type { MembershipStatus } from "./types";

interface MembershipStatusFieldProps {
  value: MembershipStatus;
  onChange: (value: MembershipStatus) => void;
  onDeleteMembership: () => void;
}

export function MembershipStatusField({
  value,
  onChange,
  onDeleteMembership,
}: MembershipStatusFieldProps) {
  const [open, setOpen] = useState(false);
  const current = STATUS_CONFIG[value];

  return (
    <div className="space-y-2">
      <label className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</label>
      <div className="relative">
        <button onClick={() => setOpen((currentValue) => !currentValue)} className="flex h-[60px] w-full items-center justify-between rounded-2xl bg-[#efefef] px-5">
          <span className={`flex items-center gap-2 font-black ${current.color}`}><span>{current.icon}</span>{current.label}</span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? (
          <div className="absolute top-full z-20 mt-2 w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
            {(Object.keys(STATUS_CONFIG) as MembershipStatus[]).map((status) => <button key={status} onClick={() => { onChange(status); setOpen(false); }} className="flex w-full items-center gap-3 border-b border-slate-50 px-6 py-4 text-sm font-black last:border-0 hover:bg-slate-50"><span>{STATUS_CONFIG[status].icon}</span><span className={STATUS_CONFIG[status].color}>{STATUS_CONFIG[status].label}</span></button>)}
            <button onClick={onDeleteMembership} className="flex w-full items-center gap-3 bg-red-50/50 px-6 py-4 text-sm font-black text-red-500"><Trash2 className="h-4 w-4" />Delete Membership</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
