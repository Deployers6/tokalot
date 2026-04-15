"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

interface SessionCreditsEditorProps {
  used: number;
  total: number;
  onChange: (used: number, total: number) => void;
}

export function SessionCreditsEditor({
  used,
  total,
  onChange,
}: SessionCreditsEditorProps) {
  const [editing, setEditing] = useState(false);
  const remaining = Math.max(total - used, 0);
  const width = total > 0 ? `${Math.min((used / total) * 100, 100)}%` : "0%";

  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Credits</p><p className="font-black text-slate-800">{editing ? "Editing credits" : `${used} used / ${remaining} left`}</p></div>
        <button onClick={() => setEditing((current) => !current)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50"><Pencil className="h-4 w-4 text-slate-400" /></button>
      </div>
      {editing ? <div className="flex items-center gap-2 font-black text-sm"><input type="number" value={used} onChange={(e) => onChange(Number(e.target.value), total)} className="w-16 rounded border bg-slate-50 px-2 py-1" /><span>/</span><input type="number" value={total} onChange={(e) => onChange(used, Number(e.target.value))} className="w-16 rounded border bg-slate-50 px-2 py-1" /></div> : null}
      <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${used >= total ? "bg-red-400" : "bg-[#20BEF9]"}`} style={{ width }} /></div>
    </section>
  );
}
