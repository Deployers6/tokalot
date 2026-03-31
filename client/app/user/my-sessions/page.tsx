"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, BookMarked, UserCircle, Info, Clock, Lock, CheckCircle2 } from "lucide-react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const upcomingSessions = [
  {
    id: 1,
    title: "Advanced Business English",
    date: "Oct 24, 2023",
    time: "18:00 - 19:30",
    status: "locked",
  },
  {
    id: 2,
    title: "IELTS Speaking Mastery",
    date: "Oct 28, 2023",
    time: "10:00 - 11:30",
    status: "cancellable",
  },
];

const historySessions = [
  {
    id: 3,
    title: "Early Stage",
    date: "Oct 24, 2023",
    time: "18:00 - 19:30",
    status: "completed",
  },
];

export default function MySessionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const [navTab, setNavTab] = useState<"schedule" | "sessions" | "profile">("sessions");

  const sessions = activeTab === "upcoming" ? upcomingSessions : historySessions;

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

            <p className="text-xs font-bold text-slate-400">MEMBER DASHBOARD</p>
            <h2 className="mt-1 text-3xl font-black text-black">My Sessions</h2>

            {/* Tabs */}
            <div className="mt-5 flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={cn(
                  "pb-3 px-1 mr-6 text-sm font-bold transition-colors border-b-2 -mb-px",
                  activeTab === "upcoming"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-slate-400"
                )}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "pb-3 px-1 text-sm font-bold transition-colors border-b-2 -mb-px",
                  activeTab === "history"
                    ? "border-sky-500 text-sky-500"
                    : "border-transparent text-slate-400"
                )}
              >
                History
              </button>
            </div>

            {/* Cancellation Policy */}
            <div className="mt-4 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <Info size={16} className="text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-sky-700">Cancellation Policy</p>
                <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                  To support our community and coaches, please note that sessions can only be
                  cancelled up to 48 hours before their scheduled start time.
                </p>
              </div>
            </div>

            {/* Session Cards */}
            <div className="mt-4 flex flex-col gap-3">
              {sessions.map((session) => {
                const isLocked = session.status === "locked";
                const isCancellable = session.status === "cancellable";
                const isCompleted = session.status === "completed";

                return (
                  <div
                    key={session.id}
                    className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden"
                    style={!isCompleted ? { borderLeft: `4px solid ${isCancellable ? "#0BC917" : "#38bdf8"}` } : undefined}
                  >
                    <div className="px-4 py-4 flex flex-col gap-3">

                      {/* Top row */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {isCancellable && (
                            <p className="text-[10px] font-bold text-green-500 mb-1">SCHEDULED</p>
                          )}
                          <p className="text-sm font-bold text-black">{session.title}</p>
                        </div>
                        {isLocked && <Lock size={16} className="text-slate-400 shrink-0 mt-0.5" />}
                        {isCancellable && <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />}
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays size={13} />
                          <span>{session.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} />
                          <span>{session.time}</span>
                        </div>
                      </div>

                      {/* Action button */}
                      {isLocked && (
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5">
                          <Lock size={13} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-400">CANCELLATION LOCKED</span>
                        </div>
                      )}
                      {isCancellable && (
                        <button className="w-full rounded-lg border border-red-300 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                          CANCEL SESSION
                        </button>
                      )}
                      {isCompleted && (
                        <div className="flex items-center justify-center rounded-lg bg-slate-100 py-2.5">
                          <span className="text-xs font-bold text-slate-400">COMPLETED</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {sessions.length === 0 && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <BookMarked size={32} className="text-slate-200" />
                  <p className="text-sm font-semibold text-slate-400">No sessions found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-black py-3">
          <button
            onClick={() => { setNavTab("schedule"); router.push("/user/dashboard"); }}
            className={cn("flex flex-col items-center gap-1 px-4 py-1 transition-colors", navTab === "schedule" ? "text-sky-400" : "text-slate-500")}
          >
            <CalendarDays size={20} />
            <span className="text-[10px] font-bold">SCHEDULE</span>
          </button>
          <button
            onClick={() => { setNavTab("profile"); router.push("/user/profile"); }}
            className={cn("flex flex-col items-center gap-1 px-4 py-1 transition-colors", navTab === "profile" ? "text-sky-400" : "text-slate-500")}
          >
            <UserCircle size={20} />
            <span className="text-[10px] font-bold">PROFILE</span>
          </button>
          <button
            onClick={() => setNavTab("sessions")}
            className={cn("flex flex-col items-center gap-1 px-4 py-1 transition-colors", navTab === "sessions" ? "text-sky-400" : "text-slate-500")}
          >
            <BookMarked size={20} />
            <span className="text-[10px] font-bold">SESSIONS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
