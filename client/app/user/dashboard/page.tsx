"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, BookMarked, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { fetchSessions, bookSession } from "@/lib/api";

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

function formatTime(isoStr: string) {
  const d = new Date(isoStr);
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h < 12 ? "AM" : "PM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const today = new Date();
  const todayFull = toFullDate(today);
  const days = getDays(today, 30);

  const [activeDay, setActiveDay] = useState(todayFull);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"schedule" | "sessions">("schedule");
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const [bookingId, setBookingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeDayObj = days.find((d) => d.fullDate === activeDay) ?? days[0];

  useEffect(() => {
    setLoading(true);
    fetchSessions(activeDay)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [activeDay]);

  async function handleBook(e: React.MouseEvent, sectionId: string) {
    e.stopPropagation();
    if (!user?.id) return;
    setBookingId(sectionId);
    try {
      await bookSession(sectionId, user.id);
      setBookedIds((prev) => new Set(prev).add(sectionId));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBookingId(null);
    }
  }

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

            <p className="text-xs font-bold tracking-widest text-slate-400">BOOK YOUR SESSION</p>
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
                    className={cn(
                      "flex h-[80px] w-[60px] shrink-0 flex-col items-center justify-center rounded-[14px] transition-all",
                      isActive ? "bg-sky-500 text-white shadow-md" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    )}
                  >
                    <span className={cn("text-[10px] font-bold tracking-wide", isActive ? "text-white/80" : "text-slate-400")}>
                      {day.label}
                    </span>
                    <span className="mt-1 text-2xl font-black leading-none">{day.date}</span>
                  </button>
                );
              })}
            </div>

            {/* Slots header */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-base font-bold text-black">Available Slots</p>
              <p className="text-xs text-slate-400">{sessions.length} sessions found</p>
            </div>

            {/* Session cards */}
            <div className="mt-3 flex flex-col gap-3">
              {loading ? (
                <div className="mt-10 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                  <p className="text-sm text-slate-400">Ачаалж байна...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="mt-10 flex flex-col items-center gap-2">
                  <CalendarDays size={36} className="text-slate-200" />
                  <p className="text-sm font-semibold text-slate-400">Энэ өдөр session байхгүй</p>
                </div>
              ) : (
                sessions.map((session, idx) => {
                  const isBooked = bookedIds.has(session.id);
                  const isBooking = bookingId === session.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => router.push(`/user/sessions/${session.id}`)}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-sky-500">
                          {formatTime(session.StartTime)} - {formatTime(session.endTime)}
                        </p>
                        <p className="text-sm font-bold text-black">{session.title}</p>
                        <p className="text-xs text-slate-400">{session.level}</p>
                      </div>
                      {isBooked ? (
                        <button className="ml-3 shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white">
                          Booked
                        </button>
                      ) : idx === 0 ? (
                        <button
                          onClick={(e) => handleBook(e, session.id)}
                          disabled={isBooking}
                          className="ml-3 shrink-0 rounded-full bg-sky-500 px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 transition-colors disabled:opacity-60"
                        >
                          {isBooking ? "..." : "Book Now"}
                        </button>
                      ) : (
                        <ChevronRight size={18} className="text-slate-300 shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })
              )}
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
            <span className="text-[10px] font-bold tracking-wide">SCHEDULE</span>
          </button>
          <button
            onClick={() => { setActiveTab("sessions"); router.push("/user/my-sessions"); }}
            className={cn("flex flex-col items-center gap-1 px-8 py-1 transition-colors", activeTab === "sessions" ? "text-sky-400" : "text-slate-500")}
          >
            <BookMarked size={20} />
            <span className="text-[10px] font-bold tracking-wide">SESSIONS</span>
          </button>
        </div>

      </div>
    </div>
  );
}
