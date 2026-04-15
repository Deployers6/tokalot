"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo, useState } from "react";
import { monthNames } from "./constants";
import { isBetween, isSameDay } from "./date-utils";

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"] as const;

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  onClose: () => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  onClose,
}: DateRangePickerProps) {
  const today = new Date();
  const [year, setYear] = useState(startDate?.getFullYear() || today.getFullYear());
  const [month, setMonth] = useState(startDate?.getMonth() || today.getMonth());
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))];
  }, [month, year]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-t-[2rem] bg-white px-6 pb-10 pt-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div><p className="text-xl font-black text-slate-900">{monthNames[month]} {year}</p><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{selecting === "start" ? "Select start date" : "Select end date"}</p></div>
        <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (month === 0) {
                  setMonth(11);
                  setYear((value) => value - 1);
                  return;
                }
                setMonth((value) => value - 1);
              }}
              className="rounded-xl bg-slate-50 p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (month === 11) {
                  setMonth(0);
                  setYear((value) => value + 1);
                  return;
                }
                setMonth((value) => value + 1);
              }}
              className="rounded-xl bg-slate-50 p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="rounded-xl bg-slate-900 p-2 text-white"><X className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-7 text-center text-[10px] font-black text-slate-300">{weekdayLabels.map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}</div>
        <div className="mt-2 grid grid-cols-7 gap-y-1">
          {days.map((day, index) => day ? <DayCell key={index} day={day} startDate={startDate} endDate={endDate} selecting={selecting} onPick={(picked) => { if (selecting === "start") { onChange(picked, null); setSelecting("end"); return; } onChange(startDate && picked < startDate ? picked : startDate, startDate && picked < startDate ? startDate : picked); setSelecting("start"); }} /> : <div key={index} />)}
        </div>
        {startDate && endDate ? <button onClick={onClose} className="mt-6 h-[60px] w-full rounded-2xl bg-black text-xs font-black uppercase tracking-[0.2em] text-white">Confirm Period</button> : null}
      </div>
    </div>
  );
}

function DayCell({ day, startDate, endDate, selecting, onPick }: { day: Date; startDate: Date | null; endDate: Date | null; selecting: "start" | "end"; onPick: (date: Date) => void }) {
  const today = new Date();
  const inRange = startDate && endDate ? isBetween(day, startDate, endDate) : false;
  const isStart = startDate ? isSameDay(day, startDate) : false;
  const isEnd = endDate ? isSameDay(day, endDate) : false;
  const current = isSameDay(day, today);
  const className = isStart || isEnd ? "bg-[#20BEF9] text-white" : inRange ? "bg-[#d7f4fd] text-[#0088b3]" : current ? "text-[#20BEF9]" : "text-slate-700";
  return <button onClick={() => onPick(day)} className={`h-10 w-full rounded-full text-sm font-bold ${className} ${selecting === "end" ? "transition-all" : ""}`}>{day.getDate()}</button>;
}
