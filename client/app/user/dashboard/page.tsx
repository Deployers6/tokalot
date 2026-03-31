"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, BookMarked, UserCircle } from "lucide-react";
import { getSessions, type Session } from "@/lib/sessions";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toFullDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDays(baseDate: Date, total = 30) {
  return Array.from({ length: total }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    return {
      label: DAY_LABELS[d.getDay()],
      date: d.getDate(),
      fullDate: toFullDate(d),
      month: d.getMonth(),
      year: d.getFullYear(),
    };
  });
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const today = new Date();
  const todayFull = toFullDate(today);
  const days = getDays(today, 30);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeDay, setActiveDay] = useState(todayFull);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTab, setActiveTab] = useState<"schedule" | "sessions" | "profile">("schedule");
  const [bookedIds, setBookedIds] = useState<Set<number>>(new Set());

  function toggleBook(id: number) {
    setBookedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  useEffect(() => {
    getSessions().then(setSessions);
  }, []);

  const activeDayObj = days.find((d) => d.fullDate === activeDay) ?? days[0];
  const filteredSessions = sessions.filter((s) => s.date === activeDay);

  return (
    <div className="flex min-h-screen items-center justify-center md:bg-neutral-200 md:py-10">
      <div className="relative flex w-full flex-col bg-white min-h-screen md:min-h-0 md:w-[390px] md:h-[860px] md:rounded-[2rem] md:shadow-2xl md:overflow-hidden">

        {/* Header */}
        <div className="bg-black px-6 py-5">
          <h1 className="text-2xl font-extrabold tracking-normal text-white">Tokalot</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 pt-6">

            <p className="text-xs font-bold tracking-normal text-slate-400">
              BOOK YOUR SESSION
            </p>
            <h2 className="mt-1 text-4xl font-black tracking-normal text-black">
              {MONTHS[activeDayObj.month]} {activeDayObj.year}
            </h2>

            {/* Scrollable days */}
            <div ref={scrollRef} className="mt-5 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {days.map((day) => {
                const isActive = activeDay === day.fullDate;
                return (
                  <button
                    key={day.fullDate}
                    onClick={() => setActiveDay(day.fullDate)}
                    id={`day-${day.fullDate}`}
                    className={cn(
                      "flex h-[88px] w-[72px] shrink-0 flex-col items-center justify-center rounded-[14px] transition-all",
                      isActive
                        ? "bg-sky-500 text-white shadow-md"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] font-bold tracking-normal",
                      isActive ? "text-white/80" : "text-slate-400"
                    )}>
                      {day.label}
                    </span>
                    <span className="mt-1 text-3xl font-black leading-none">{day.date}</span>
                  </button>
                );
              })}
            </div>

            {/* Slots header */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-base font-bold text-black">Available Slots</p>
              <p className="text-xs text-slate-400">{filteredSessions.length} sessions found</p>
            </div>

            {/* Session cards */}
            <div className="mt-3 flex flex-col gap-3">
              {filteredSessions.length === 0 ? (
                <div className="mt-10 flex flex-col items-center gap-2">
                  <CalendarDays size={36} className="text-slate-200" />
                  <p className="text-sm font-semibold text-slate-400">No sessions this day</p>
                </div>
              ) : (
                filteredSessions.map((session, i) => (
                  <div
                    key={session.id}
                    onClick={() => router.push(`/user/sessions/${session.id}`)}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white py-4 pl-5 pr-4 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                    style={{ borderLeft: `4px solid ${bookedIds.has(session.id) ? "#0BC917" : "#38bdf8"}` }}
                  >
                    <div>
                      <p className="text-xs font-semibold text-sky-500">
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-black">{session.title}</p>
                      <p className="text-xs text-slate-400">{session.level}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleBook(session.id); }}
                      className="ml-3 shrink-0 rounded-[5px] px-4 py-2 text-xs font-bold text-white transition-colors"
                      style={{ backgroundColor: bookedIds.has(session.id) ? "#0BC917" : "#38bdf8" }}
                    >
                      {bookedIds.has(session.id) ? "Booked" : "Book Now"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-black py-3">
          <button
            onClick={() => setActiveTab("schedule")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              activeTab === "schedule" ? "text-sky-400" : "text-slate-500"
            )}
          >
            <CalendarDays size={20} />
            <span className="text-[10px] font-bold tracking-normal">SCHEDULE</span>
          </button>
          <button
            onClick={() => { setActiveTab("profile"); router.push("/user/profile"); }}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              activeTab === "profile" ? "text-sky-400" : "text-slate-500"
            )}
          >
            <UserCircle size={20} />
            <span className="text-[10px] font-bold tracking-normal">PROFILE</span>
          </button>
          <button
            onClick={() => { setActiveTab("sessions"); router.push("/user/my-sessions"); }}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              activeTab === "sessions" ? "text-sky-400" : "text-slate-500"
            )}
          >
            <BookMarked size={20} />
            <span className="text-[10px] font-bold tracking-normal">SESSIONS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
