

"use client";
import { useState } from "react";

const MONTHS = [
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
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface SelectedDate {
  day: number;
  month: number;
  year: number;
}

interface Props {
  selected: SelectedDate | null;
  setSelected: (val: SelectedDate | null) => void;
}

export default function DatePicker({ selected, setSelected }: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [open, setOpen] = useState(false);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const label = selected
    ? `${MONTHS[selected.month]} ${selected.day}, ${selected.year}`
    : `${MONTHS[currentMonth]} ${currentYear}`;

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-[#E0F8FF] border-2 border-[#BCC8D1] rounded-2xl px-5 py-3 hover:shadow-md transition-all h-13"
      >
        <CalendarIcon />
        <span className="text-teal-900 font-bold text-lg">{label}</span>
        <ChevronIcon />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-16 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-80 z-50">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <span className="text-gray-500">‹</span>
            </button>
            <span className="font-semibold text-gray-800">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <span className="text-gray-500">›</span>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-gray-400"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={i} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                selected?.day === day &&
                selected?.month === currentMonth &&
                selected?.year === currentYear;
              const isToday =
                today.getDate() === day &&
                today.getMonth() === currentMonth &&
                today.getFullYear() === currentYear;
              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelected({
                      day,
                      month: currentMonth,
                      year: currentYear,
                    });
                    setOpen(false);
                  }}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-all
                    ${isSelected ? "bg-teal-600 text-white" : isToday ? "border border-teal-400 text-teal-700" : "text-gray-700 hover:bg-teal-50"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {selected && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm text-teal-700 font-medium">
                {MONTHS[selected.month]} {selected.day}, {selected.year}
              </span>
              <button
                onClick={() => setSelected(null)}
                className="text-xs text-gray-400 hover:text-red-400"
              >
                Арилгах
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="w-6 h-6 text-[#006688]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
      <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
      <line
        x1="16"
        y1="2"
        x2="16"
        y2="6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="w-4 h-4 text-[#3D484F]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 9l6 6 6-6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
