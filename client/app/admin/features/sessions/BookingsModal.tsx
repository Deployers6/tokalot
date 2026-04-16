"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ADMIN_BACKEND_URL, asList } from "../common/api";
import type { Booking, ClerkUser, Section } from "./types";

interface BookingsModalProps {
  section: Section;
  adminId?: string | null;
  onClose: () => void;
}

export function BookingsModal({ section, adminId, onClose }: BookingsModalProps) {
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (adminId) headers["x-admin-id"] = adminId;
    fetch(`${ADMIN_BACKEND_URL}/api/admin/get-user`, { headers })
      .then((response) => response.json())
      .then((data) => setUsers(asList<ClerkUser>(data, "users")))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [adminId]);

  const rows = section.bookings || [];
  const active = rows.filter((booking) => booking.status);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="flex max-h-[75vh] w-full max-w-2xl flex-col rounded-t-[2rem] bg-white px-6 pb-8 pt-4" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-slate-300" />
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Bookings</h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{section.title}</p>
          </div>
          <button onClick={onClose} className="rounded-xl bg-slate-100 p-2 text-slate-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <StatCard value={active.length} label="Active" tone="blue" />
          <StatCard value={rows.length - active.length} label="Cancelled" tone="gray" />
          <StatCard value={section.capacity} label="Capacity" tone="gray" />
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {loading ? <Loader2 className="mx-auto mt-10 h-6 w-6 animate-spin text-[#20BEF9]" /> : null}
          {!loading && !rows.length ? <EmptyState /> : null}
          {rows.map((booking) => {
            const user = users.find((item) => item.clerkId === booking.clerkId);
            return <BookingRow key={booking.id} booking={booking} user={user} />;
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, tone }: { value: number; label: string; tone: "blue" | "gray" }) {
  const tones = tone === "blue" ? "bg-[#e0f8ff] text-[#20BEF9]" : "bg-slate-50 text-slate-400";
  return <div className={`rounded-2xl px-4 py-3 text-center ${tones}`}><p className="text-xl font-black">{value}</p><p className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</p></div>;
}

function EmptyState() {
  return <div className="py-10 text-center text-sm font-bold uppercase tracking-[0.2em] text-slate-300">No bookings yet</div>;
}

function BookingRow({ booking, user }: { booking: Booking; user?: ClerkUser }) {
  const initials = (user?.fullName || booking.clerkId).split(" ").map((item) => item[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${booking.status ? "border-[#a8e6fa] bg-[#e0f8ff]" : "border-slate-100 bg-slate-50"}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black ${booking.status ? "bg-[#20BEF9] text-white" : "bg-slate-200 text-slate-400"}`}>{initials}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-800">{user?.fullName || booking.clerkId}</p>
        <p className="truncate text-[10px] font-medium text-slate-400">{user?.email || "No email"}{user?.membershipStatus ? ` · ${user.membershipStatus}` : ""}</p>
      </div>
      <span className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase ${booking.status ? "bg-[#20BEF9]/20 text-[#006688]" : "bg-slate-200 text-slate-400"}`}>
        {booking.status ? "Active" : "Cancelled"}
      </span>
    </div>
  );
}
