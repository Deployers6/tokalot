"use client";
import { CalendarIcon, Loader2, X } from "lucide-react";
import React, { useState, useEffect } from "react";

interface Teacher {
  id: string;
  fullName: string;
}

const BACKEND_URL = "https://tokalot.vercel.app";

export default function CreateSession({
  onClose,
  onSuccess,
  defaultDate, // ← нэмсэн
}: {
  onClose?: () => void;
  onSuccess?: () => void;
  defaultDate?: string; // ← нэмсэн
}) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    sessionDate: defaultDate ?? today, // ← өөрчилсөн
    startTime: "",
    endTime: "",
    capacity: "15",
    teacherId: "",
  });

  // optional sync (safe нэмэлт)
  useEffect(() => {
    if (defaultDate) {
      setForm((prev) => ({ ...prev, sessionDate: defaultDate }));
    }
  }, [defaultDate]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`Teachers API error: ${res.status}`);
        const data = await res.json();
        setTeachers(Array.isArray(data) && data.length > 0 ? data : []);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        setTeachers([]);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchTeachers();
  }, []);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.teacherId || !form.startTime || !form.endTime) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }
    if (form.endTime <= form.startTime) {
      setError("End time нь start time-аас хожуу байх ёстой.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        level: "Beginner",
        teacherId: form.teacherId,
        StartTime: `${form.sessionDate}T${form.startTime}:00`,
        endTime: `${form.sessionDate}T${form.endTime}:00`,
        capacity: form.capacity,
      };
      console.log("Sending payload:", payload);
      const res = await fetch(`${BACKEND_URL}/api/admin-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Server response:", errData);
        throw new Error(
          errData.message || errData.error || `Server error: ${res.status}`,
        );
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Алдаа гарлаа";
      setError(msg);
      console.error("Submit error:", msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "bg-transparent outline-none text-sm w-full";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <div className="bg-[#C2E8FF] p-2 rounded-xl">
            <CalendarIcon className="h-5 w-5 text-[#006688]" />
          </div>
          <h2 className="font-extrabold text-lg">Create New Session</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">
          SESSION NAME
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={set}
          required
          placeholder="e.g. TOEFL Speaking Practice"
          className={inputCls}
        />
      </div>

      <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">
          SESSION DATE
        </label>
        <input
          type="date"
          name="sessionDate"
          value={form.sessionDate}
          onChange={set}
          required
          className={inputCls}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
          <label className="text-xs font-extrabold tracking-widest text-gray-500">
            START TIME
          </label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={set}
            required
            className={inputCls}
          />
        </div>
        <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
          <label className="text-xs font-extrabold tracking-widest text-gray-500">
            END TIME
          </label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={set}
            required
            className={inputCls}
          />
        </div>
      </div>

      <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">
          SEATS
        </label>
        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={set}
          min="1"
          className={inputCls}
        />
      </div>

      <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">
          TEACHER
        </label>
        <select
          name="teacherId"
          value={form.teacherId}
          onChange={set}
          required
          disabled={loadingTeachers}
          className={`${inputCls} text-gray-700`}
        >
          <option value="">
            {loadingTeachers
              ? "Багш ачаалж байна..."
              : teachers.length === 0
                ? "Багш олдоогүй"
                : "Select a Teacher"}
          </option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.fullName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || loadingTeachers}
        className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl mt-1 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "ҮҮСГЭЖ БУЙ..." : "PUBLISH SESSION"}
      </button>
    </form>
  );
}
