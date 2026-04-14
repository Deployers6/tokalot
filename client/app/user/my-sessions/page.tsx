"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  BookMarked,
  Info,
  Clock,
  CheckCircle2,
  UserCircle,
  Lock,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { fetchMyBookings, cancelBooking } from "@/lib/api";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(isoStr: string) {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(isoStr: string) {
  const d = new Date(isoStr);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const period = h < 12 ? "AM" : "PM";
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

export default function MySessionsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );
  const [navTab, setNavTab] = useState<"schedule" | "profile" | "sessions">(
    "sessions",
  );
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelMsg, setCancelMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    const status = activeTab === "upcoming" ? "upcoming" : "completed";
    fetchMyBookings(user.id, status)
      .then((data) => {
        if (activeTab === "history") {
          const cancelled = getCancelledLocally().map((b: any) => ({
            ...b,
            status: false,
          }));
          const dbIds = new Set(data.map((b: any) => b.id));
          const merged = [
            ...cancelled.filter((b: any) => !dbIds.has(b.id)),
            ...data,
          ];
          setBookings(merged);
        } else {
          const cancelledIds = new Set(
            getCancelledLocally().map((b: any) => b.id),
          );
          setBookings(data.filter((b: any) => !cancelledIds.has(b.id)));
        }
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [activeTab, user?.id]);

  function saveCancelledLocally(booking: any) {
    const key = `cancelled_bookings_${user?.id}`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const alreadyExists = existing.find((b: any) => b.id === booking.id);
    if (!alreadyExists) {
      existing.unshift({ ...booking, cancelledAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    }
  }

  function getCancelledLocally(): any[] {
    if (!user?.id) return [];
    const key = `cancelled_bookings_${user.id}`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  async function handleCancel(bookingId: string) {
    if (!user?.id) return;
    if (!confirm("Энэ session-г цуцлах уу?")) return;
    setCancellingId(bookingId);
    try {
      const booking = bookings.find((b) => b.id === bookingId);
      await cancelBooking(bookingId, user.id);
      if (booking) saveCancelledLocally(booking);
      setCancelMsg("Session цуцлагдлаа. 1 credit буцаан нэмэгдлээ.");
      setTimeout(() => setCancelMsg(null), 4000);
      setActiveTab("history");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCancellingId(null);
    }
  }

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
              {(["upcoming", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-3 px-1 mr-6 text-sm font-bold transition-colors border-b-2 -mb-px capitalize",
                    activeTab === tab
                      ? "border-sky-500 text-sky-500"
                      : "border-transparent text-slate-400",
                  )}
                >
                  {tab === "upcoming" ? "Upcoming" : "History"}
                </button>
              ))}
            </div>

            {/* Cancel result message */}
            {cancelMsg && (
              <div className="mt-4 rounded-xl px-4 py-3 text-sm font-semibold text-center bg-green-50 border border-green-200 text-green-600">
                {cancelMsg}
              </div>
            )}

            {/* Cancellation Policy */}
            <div className="mt-4 flex gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
              <Info size={16} className="text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-sky-700">
                  Cancellation Policy
                </p>
                <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                  Sessions can only be cancelled up to 48 hours before their
                  scheduled start time.
                </p>
              </div>
            </div>

            {/* Session Cards */}
            <div className="mt-4 flex flex-col gap-3">
              {loading ? (
                <div className="mt-10 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                  <p className="text-sm text-slate-400">Ачаалж байна...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <BookMarked size={32} className="text-slate-200" />
                  <p className="text-sm font-semibold text-slate-400">
                    Session байхгүй байна
                  </p>
                </div>
              ) : (
                bookings.map((booking) => {
                  const section = booking.section;
                  const isCancelled = booking.status === false;
                  const isCompleted = activeTab === "history" && !isCancelled;
                  const hoursLeft =
                    (new Date(section.StartTime).getTime() - Date.now()) /
                    (1000 * 60 * 60);
                  const isLocked =
                    !isCancelled &&
                    activeTab === "upcoming" &&
                    hoursLeft > 0 &&
                    hoursLeft < 48;
                  const cancellable =
                    !isCancelled && activeTab === "upcoming" && hoursLeft >= 48;

                  const borderColor = isCancelled
                    ? "#f87171"
                    : isLocked
                      ? "#38bdf8"
                      : cancellable
                        ? "#0BC917"
                        : "#38bdf8";

                  return (
                    <div
                      key={booking.id}
                      className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden"
                      style={
                        activeTab === "upcoming" || isCancelled
                          ? { borderLeft: `4px solid ${borderColor}` }
                          : undefined
                      }
                    >
                      <div className="px-4 py-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {isCancelled && (
                              <p className="text-[10px] font-bold text-red-400 mb-1">
                                CANCELLED
                              </p>
                            )}
                            {cancellable && (
                              <p className="text-[10px] font-bold text-green-500 mb-1">
                                SCHEDULED
                              </p>
                            )}
                            <p className="text-sm font-bold text-black">
                              {section.title}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {section.level}
                            </p>
                          </div>
                          {cancellable && (
                            <CheckCircle2
                              size={18}
                              className="text-green-500 shrink-0 mt-0.5"
                            />
                          )}
                          {isLocked && (
                            <Lock
                              size={16}
                              className="text-slate-400 shrink-0 mt-0.5"
                            />
                          )}
                        </div>

                        <div className="flex flex-col gap-1 text-xs text-slate-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays size={13} />
                              <span>{formatDate(section.StartTime)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} />
                              <span>
                                {formatTime(section.StartTime)} -{" "}
                                {formatTime(section.endTime)}
                              </span>
                            </div>
                          </div>
                          {isCancelled &&
                            (booking.cancelledAt || booking.updatedAt) && (
                              <p className="text-[11px] text-red-400 font-medium">
                                Цуцалсан:{" "}
                                {new Date(
                                  booking.cancelledAt || booking.updatedAt,
                                ).toLocaleString("mn-MN", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                        </div>

                        {isLocked && (
                          <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5">
                            <Lock size={13} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-400">
                              CANCELLATION LOCKED
                            </span>
                          </div>
                        )}
                        {cancellable && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="w-full rounded-lg border border-red-300 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {cancellingId === booking.id
                              ? "Цуцалж байна..."
                              : "CANCEL SESSION"}
                          </button>
                        )}
                        {isCompleted && (
                          <div className="flex items-center justify-center rounded-lg bg-slate-100 py-2.5">
                            <span className="text-xs font-bold text-slate-400">
                              COMPLETED
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-black py-3">
          <button
            onClick={() => {
              setNavTab("schedule");
              router.push("/user/dashboard");
            }}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              navTab === "schedule" ? "text-sky-400" : "text-slate-500",
            )}
          >
            <CalendarDays size={20} />
            <span className="text-[10px] font-bold">SCHEDULE</span>
          </button>
          <button
            onClick={() => {
              setNavTab("profile");
              router.push("/user/profile");
            }}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              navTab === "profile" ? "text-sky-400" : "text-slate-500",
            )}
          >
            <UserCircle size={20} />
            <span className="text-[10px] font-bold">PROFILE</span>
          </button>
          <button
            onClick={() => setNavTab("sessions")}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
              navTab === "sessions" ? "text-sky-400" : "text-slate-500",
            )}
          >
            <BookMarked size={20} />
            <span className="text-[10px] font-bold">SESSIONS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
