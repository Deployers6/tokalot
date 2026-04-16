import type { HistoryItem } from "./types";

export function MembershipHistoryList({ history }: { history: HistoryItem[] }) {
  if (!history.length) return null;

  return (
    <section className="space-y-3">
      <h3 className="ml-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Session History</h3>
      <div className="space-y-2">
        {history.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-50 bg-white p-4 shadow-sm">
            <div><p className="text-xs font-black text-slate-800">{item.action}</p><p className="mt-0.5 text-[9px] font-bold uppercase text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p></div>
            <span className={`text-sm font-black ${item.change < 0 ? "text-red-400" : "text-green-500"}`}>{item.change > 0 ? `+${item.change}` : item.change}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
