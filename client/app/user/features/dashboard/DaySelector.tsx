import type { DayOption } from "./types";

export function DaySelector({
  days,
  activeDay,
  onSelect,
}: {
  days: DayOption[];
  activeDay: string;
  onSelect: (date: string) => void;
}) {
  return (
    <div className="mt-5 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {days.map((day) => {
        const active = activeDay === day.fullDate;
        return (
          <button key={day.fullDate} onClick={() => onSelect(day.fullDate)} className={`flex h-[80px] w-[60px] shrink-0 flex-col items-center justify-center rounded-[14px] ${active ? "bg-sky-500 text-white shadow-md" : "bg-slate-100 text-slate-800"}`}>
            <span className={`text-[10px] font-bold tracking-wide ${active ? "text-white/80" : "text-slate-400"}`}>{day.label}</span>
            <span className="mt-1 text-2xl font-black leading-none">{day.date}</span>
          </button>
        );
      })}
    </div>
  );
}
