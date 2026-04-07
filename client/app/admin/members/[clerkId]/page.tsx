"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  Camera,
  User,
  ChevronDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const BACKEND_URL = "https://tokalot.vercel.app";

type MembershipStatus = "ACTIVE" | "PENDING" | "EXPIRED";

interface HistoryItem {
  id: string;
  action: string;
  change: number;
  createdAt: string;
}

interface UserDetail {
  clerkId: string;
  fullName: string;
  email?: string;
  image?: string;
}

interface MembershipData {
  clerkId: string;
  startDate?: string;
  endDate?: string;
  totalSessions: number;
  usedSessions: number;
  status: string;
  history: HistoryItem[];
}

const STATUS_CONFIG = {
  ACTIVE: { label: "Active", icon: "✅", color: "text-green-600" },
  PENDING: { label: "Pending", icon: "🟡", color: "text-yellow-500" },
  EXPIRED: { label: "Expired", icon: "❌", color: "text-red-500" },
};

const normalizeStatus = (s?: string): MembershipStatus => {
  if (s === "ACTIVE") return "ACTIVE";
  if (s === "EXPIRED") return "EXPIRED";
  return "PENDING";
};

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
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Огноог цагийн бүсийн зөрүүгүйгээр "YYYY-MM-DD" текст болгох функц
const toLocalDateString = (d: Date | null) => {
  if (!d) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function isBetween(d: Date, start: Date, end: Date) {
  return d > start && d < end;
}
function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  onClose: () => void;
}

function DateRangePicker({
  startDate,
  endDate,
  onChange,
  onClose,
}: DateRangePickerProps) {
  const today = startOfDay(new Date());
  const [viewYear, setViewYear] = useState(
    startDate ? startDate.getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    startDate ? startDate.getMonth() : today.getMonth(),
  );
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [hovered, setHovered] = useState<Date | null>(null);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      startOfDay(new Date(viewYear, viewMonth, i + 1)),
    ),
  ];

  const handleDayClick = (day: Date) => {
    if (selecting === "start") {
      onChange(day, null);
      setSelecting("end");
    } else {
      if (startDate && day < startDate) onChange(day, startDate);
      else onChange(startDate, day);
      setSelecting("start");
    }
  };

  const getDayStyle = (day: Date) => {
    const isStart = startDate && isSameDay(day, startDate);
    const isEnd = endDate && isSameDay(day, endDate);
    const isToday = isSameDay(day, today);
    const hoverEnd =
      selecting === "end" &&
      hovered &&
      startDate &&
      day <= hovered &&
      day >= startDate;
    const inRange =
      startDate && endDate
        ? isBetween(day, startDate, endDate)
        : hoverEnd && !isStart;
    let bg = "bg-transparent",
      text = "text-gray-800",
      rounded = "rounded-full",
      fw = "font-medium";
    if (isStart || isEnd) {
      bg = "bg-[#20BEF9]";
      text = "text-white";
      fw = "font-bold";
    } else if (inRange) {
      bg = "bg-[#D7F4FD]";
      text = "text-[#0088B3]";
      rounded = "rounded-none";
    }
    if (isStart && endDate) rounded = "rounded-l-full rounded-r-none";
    if (isEnd && startDate) rounded = "rounded-r-full rounded-l-none";
    if (isToday && !isStart && !isEnd) text = "text-[#20BEF9] font-bold";
    return `${bg} ${text} ${rounded} ${fw}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30">
      <div className="w-full max-w-sm bg-white rounded-t-3xl shadow-2xl pb-8">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="text-lg font-extrabold text-gray-900">
              {MONTHS[viewMonth]} {viewYear}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {selecting === "start" ? "Select start date" : "Select end date"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 ml-1"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 px-3 mb-1">
          {DAYS.map((d, i) => (
            <div
              key={i}
              className="text-center text-[11px] font-bold text-gray-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 px-3 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            return (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                className={`h-9 w-full flex items-center justify-center text-sm transition-colors ${getDayStyle(day)}`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
        <div className="mx-5 mt-4 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              Start
            </p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {startDate
                ? startDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center flex-1">
            <p className="text-[10px] text-gray-400 font-semibold uppercase">
              End
            </p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {endDate
                ? endDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>
        {startDate && endDate && (
          <div className="px-5 mt-4">
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-2xl text-sm"
            >
              Confirm Period
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditUserPage() {
  const params = useParams();
  const clerkId = params?.clerkId as string;
  const router = useRouter();
  const { userId } = useAuth();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [membershipStatus, setMembershipStatus] =
    useState<MembershipStatus>("PENDING");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [sessionUsed, setSessionUsed] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [editingSessions, setEditingSessions] = useState(false);
  const [membershipStart, setMembershipStart] = useState<Date | null>(null);
  const [membershipEnd, setMembershipEnd] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (userId && clerkId) fetchAll();
  }, [userId, clerkId]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersRes = await fetch(`${BACKEND_URL}/api/admin/get-user`, {
        headers: { "x-admin-id": userId ?? "" },
      });
      if (!usersRes.ok) throw new Error(`get-user: ${usersRes.status}`);
      const usersData = await usersRes.json();
      const users = Array.isArray(usersData)
        ? usersData
        : (usersData?.users ?? []);
      const found = users.find((u: any) => u.clerkId === clerkId);
      if (!found) {
        setError("User not found");
        return;
      }
      setUser(found);
      setFullName(found.fullName ?? "");

      const memRes = await fetch(`${BACKEND_URL}/api/admin/membership`, {
        headers: {
          "x-user-id": clerkId,
          "x-admin-id": userId ?? "",
        },
      });

      let memData: MembershipData | null = null;
      if (memRes.ok) {
        memData = await memRes.json();
      }

      setMembership(memData);
      setMembershipStatus(normalizeStatus(memData?.status));
      setSessionUsed(memData?.usedSessions ?? 0);
      setSessionTotal(memData?.totalSessions ?? 0);

      // Ирсэн огноог JS Date болгохдоо цагийн бүсийн нөлөөгүйгээр салгаж авна
      if (memData?.startDate) {
        const parts = memData.startDate.split("T")[0].split("-");
        setMembershipStart(
          new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2]),
          ),
        );
      }
      if (memData?.endDate) {
        const parts = memData.endDate.split("T")[0].split("-");
        setMembershipEnd(
          new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2]),
          ),
        );
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const parts = fullName.trim().split(" ");
      await fetch(`${BACKEND_URL}/api/admin/patch-user`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetClerkId: clerkId,
          adminClerkId: userId,
          firstName: parts[0] ?? "",
          lastName: parts.slice(1).join(" "),
        }),
      });

      // ХАМГИЙН ЧУХАЛ: .toISOString() биш toLocalDateString() ашиглана
      await fetch(`${BACKEND_URL}/api/admin/membership`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": clerkId,
        },
        body: JSON.stringify({
          clerkId,
          startDate: toLocalDateString(membershipStart),
          endDate: toLocalDateString(membershipEnd),
          totalSessions: sessionTotal,
          usedSessions: sessionUsed,
          status: membershipStatus,
        }),
      });

      router.back();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetClerkId: clerkId, adminClerkId: userId }),
      });
      router.back();
    } catch (err) {
      console.error(err);
    }
  };

  const statusCfg = STATUS_CONFIG[membershipStatus];
  const remaining = Math.max(sessionTotal - sessionUsed, 0);
  const sessionPct = sessionTotal > 0 ? (sessionUsed / sessionTotal) * 100 : 0;

  const formatPeriod = () => {
    if (!membershipStart && !membershipEnd) return "Tap to set period";
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    if (membershipStart && membershipEnd)
      return `${fmt(membershipStart)} – ${fmt(membershipEnd)}`;
    if (membershipStart) return `From ${fmt(membershipStart)}`;
    return "—";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-red-500 text-sm">{error ?? "User not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
      `}</style>

      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 bg-gray-900 sticky top-0 z-40">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <p className="text-white text-sm font-bold">Edit Student Profile</p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-[#20BEF9] text-sm font-bold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-32">
          <div className="flex flex-col items-center pt-8 pb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#20BEF9] bg-gray-100">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🧑
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-gray-900 rounded-full p-1.5">
                <Camera className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-400 font-medium">
              Change Photo
            </p>
            {membershipStatus === "EXPIRED" && (
              <div className="mt-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
                <span className="text-xs font-bold text-red-500">
                  ❌ MEMBERSHIP EXPIRED
                </span>
              </div>
            )}
          </div>

          <div className="px-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
                Full Name
              </label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
                Membership Status
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown((p) => !p)}
                  className="w-full flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <span>{statusCfg.icon}</span>
                    <span
                      className={`text-sm font-semibold ${statusCfg.color}`}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {showStatusDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowStatusDropdown(false)}
                    />
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                      {(Object.keys(STATUS_CONFIG) as MembershipStatus[]).map(
                        (s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setMembershipStatus(s);
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full px-5 py-4 flex items-center justify-center gap-2 text-sm font-semibold border-b border-gray-50 last:border-0 hover:bg-gray-50 ${membershipStatus === s ? "bg-blue-50" : ""}`}
                          >
                            <span>{STATUS_CONFIG[s].icon}</span>
                            <span className={STATUS_CONFIG[s].color}>
                              {STATUS_CONFIG[s].label}
                            </span>
                            {membershipStatus === s && (
                              <span className="ml-auto text-[#20BEF9] text-xs">
                                ✓
                              </span>
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
                Membership Period
              </label>
              <button
                onClick={() => setShowCalendar(true)}
                className="w-full flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">📅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                    Period
                  </p>
                  <p
                    className={`text-sm font-semibold mt-0.5 truncate ${membershipStart ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formatPeriod()}
                  </p>
                </div>
                <Pencil className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </button>
              {membershipStart && membershipEnd && (
                <div className="mt-2 px-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    {(() => {
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                      const s = new Date(membershipStart);
                      s.setHours(0, 0, 0, 0);
                      const e = new Date(membershipEnd);
                      e.setHours(0, 0, 0, 0);

                      const total = e.getTime() - s.getTime();
                      const elapsed = Math.min(
                        Math.max(now.getTime() - s.getTime(), 0),
                        total,
                      );
                      const pct = total > 0 ? (elapsed / total) * 100 : 0;
                      return (
                        <div
                          className="h-full bg-[#20BEF9] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      );
                    })()}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">
                    {Math.ceil(
                      (membershipEnd.getTime() - membershipStart.getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) + 1}{" "}
                    days
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🎫</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                      Session Credits
                    </p>
                    {editingSessions ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={sessionUsed}
                          onChange={(e) =>
                            setSessionUsed(Number(e.target.value))
                          }
                          className="w-12 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-2 py-0.5 outline-none"
                        />
                        <span className="text-sm text-gray-400 font-semibold">
                          /{" "}
                        </span>
                        <input
                          type="number"
                          value={sessionTotal}
                          onChange={(e) =>
                            setSessionTotal(Number(e.target.value))
                          }
                          className="w-12 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-2 py-0.5 outline-none"
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        {sessionUsed} used /{" "}
                        <span
                          className={
                            remaining === 0 ? "text-red-500" : "text-green-600"
                          }
                        >
                          {remaining} left
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={() => setEditingSessions((p) => !p)}>
                  <Pencil className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${sessionPct >= 100 ? "bg-red-400" : "bg-[#20BEF9]"}`}
                  style={{ width: `${Math.min(sessionPct, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
                <span>USED: {sessionUsed}</span>
                <span>TOTAL: {sessionTotal}</span>
              </div>
            </div>

            {membership?.history && membership.history.length > 0 && (
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 mb-3">
                  Session History
                </h3>
                <div className="space-y-2">
                  {membership.history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {h.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(h.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-bold ${h.change < 0 ? "text-red-400" : h.change > 0 ? "text-green-500" : "text-gray-400"}`}
                      >
                        {h.change < 0
                          ? h.change
                          : h.change > 0
                            ? `+${h.change}`
                            : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-semibold py-3"
            >
              <Trash2 className="h-4 w-4" /> Delete Profile
            </button>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-white border-t border-gray-100">
          <button
            onClick={() => router.back()}
            className="w-full py-4 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>

      {showCalendar && (
        <DateRangePicker
          startDate={membershipStart}
          endDate={membershipEnd}
          onChange={(s, e) => {
            setMembershipStart(s);
            setMembershipEnd(e);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </>
  );
}
