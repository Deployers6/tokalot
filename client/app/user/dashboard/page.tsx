"use client";

import { useState } from "react";
import { CalendarDays, BookMarked } from "lucide-react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const days = [
  { label: "MON", date: 16 },
  { label: "TUE", date: 17 },
  { label: "WED", date: 18, active: true },
  { label: "THU", date: 19 },
  { label: "FRI", date: 20 },
];

const slots = [
  {
    time: "09:00 - 10:30 AM",
    title: "Daily Coffee Talk",
    level: "Intermediate Level",
    spots: "12/15 Spots",
    featured: true,
  },
  {
    time: "09:00 - 10:30 AM",
    title: "Daily Coffee Talk",
    level: "Intermediate Level",
    spots: "12/15 Spots",
  },
  {
    time: "09:00 - 10:30 AM",
    title: "Daily Coffee Talk",
    level: "Intermediate Level",
    spots: "12/15 Spots",
  },
  {
    time: "09:00 - 10:30 AM",
    title: "Daily Coffee Talk",
    level: "Intermediate Level",
    spots: "12/15 Spots",
  },
];

export default function DashboardPage() {
  const [activeDay, setActiveDay] = useState(18);
  const [activeTab, setActiveTab] = useState<"schedule" | "sessions">(
    "schedule",
  );

  return (
    <div className="flex min-h-screen items-center justify-center md:bg-neutral-200 md:py-10">
      <div className="relative flex w-full flex-col bg-white min-h-screen md:min-h-0 md:w-[390px] md:h-[860px] md:rounded-[2rem] md:shadow-2xl md:overflow-hidden">
        {/* Header */}
        <div className="bg-black px-6 py-5">
          <h1 className="text-2xl font-extrabold text-white">Tokalot</h1>

        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 pt-6">
            <p className="text-xs font-bold tracking-[0.3em] text-slate-400">
              BOOK YOUR SESSION
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-black">
              March 2026
            </h2>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {days.map((day) => {
                const isActive = activeDay === day.date;
                return (
                  <button
                    key={day.date}
                    onClick={() => setActiveDay(day.date)}
                    className={cn(
                      "flex h-[88px] w-[72px] shrink-0 flex-col items-center justify-center rounded-2xl border transition-all",
                      isActive
                        ? "border-sky-500 bg-sky-500 text-white shadow-md"
                        : "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200",
                    )}
                  >
                    <span className={cn("text-[10px] font-bold tracking-widest", isActive ? "text-white/80" : "text-slate-400")}>
                      {day.label}
                    </span>
                    <span className="mt-1 text-3xl font-black leading-none">{day.date}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-base font-bold text-black">Available Slots</p>
              <p className="text-xs text-slate-400">{slots.length} sessions found</p>
            </div>

            <div className="mt-3 flex flex-col gap-3">
              {slots.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white py-4 pl-4 pr-4 shadow-sm"
                  style={{ borderLeft: "4px solid #38bdf8" }}
                >
                  <div>
                    <p className="text-xs font-semibold text-sky-500">{slot.time}</p>
                    <p className="mt-0.5 text-sm font-bold text-black">{slot.title}</p>
                    <p className="text-xs text-slate-400">{slot.level} • {slot.spots}</p>
                  </div>
                  {slot.featured ? (
                    <button className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 transition-colors">
                      Book Now
                    </button>
                  ) : (
                    <span className="text-slate-300 text-lg">›</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-black py-3">
          <button
            onClick={() => setActiveTab("schedule")}
            className={cn("flex flex-col items-center gap-1 px-8 py-1 transition-colors", activeTab === "schedule" ? "text-sky-400" : "text-slate-500")}
          >
            <CalendarDays size={20} />
            <span className="text-[10px] font-bold tracking-widest">SCHEDULE</span>
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={cn("flex flex-col items-center gap-1 px-8 py-1 transition-colors", activeTab === "sessions" ? "text-sky-400" : "text-slate-500")}
          >
            <BookMarked size={20} />
            <span className="text-[10px] font-bold tracking-widest">SESSIONS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
