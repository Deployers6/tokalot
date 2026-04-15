"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CalendarPickerProps {
  selectedDate: string;
  activeDates: Set<string>;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CalendarPicker({
  selectedDate,
  activeDates,
  onSelect,
  onClose,
}: CalendarPickerProps) {
  const [viewYear, viewMonth] = selectedDate.split("-").map(Number);
  const [year, setYear] = useState(viewYear);
  const [month, setMonth] = useState(viewMonth - 1);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear((value) => value - 1);
                return;
              }
              setMonth((value) => value - 1);
            }}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-sm font-black text-slate-800">{months[month]} {year}</p>
          <button
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear((value) => value + 1);
                return;
              }
              setMonth((value) => value + 1);
            }}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-black text-slate-400">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, index) => {
            if (!day) return <div key={index} />;
            const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const selected = date === selectedDate;
            const active = activeDates.has(date);
            return (
              <button
                key={date}
                onClick={() => onSelect(date)}
                className={`mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-xl text-xs font-bold ${
                  selected ? "bg-[#20BEF9] text-white" : "text-slate-700 hover:bg-blue-50"
                }`}
              >
                <span>{day}</span>
                {active ? <span className={`mt-0.5 h-1 w-1 rounded-full ${selected ? "bg-white" : "bg-[#20BEF9]"}`} /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
