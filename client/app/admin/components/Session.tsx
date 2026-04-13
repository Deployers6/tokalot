// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   CalendarIcon,
//   Loader2,
//   ArrowLeft,
//   Plus,
//   Users,
//   User,
//   Lock,
//   PencilIcon,
//   Info,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import CreateSession from "./CreateSession";

// interface Teacher {
//   id: string;
//   fullName: string;
// }

// interface Section {
//   id: string;
//   title: string;
//   level: string;
//   teacherId: string;
//   teacher?: { fullName: string };
//   StartTime: string;
//   endTime: string;
//   capacity: number;
//   status: boolean;
//   bookings?: any[];
// }

// const BACKEND_URL = "https://tokalot.vercel.app";

// function formatTime(iso: string) {
//   try {
//     const timePart = iso.includes("T") ? iso.split("T")[1] : iso;
//     const [hour, minute] = timePart.split(":");
//     const h = parseInt(hour, 10);
//     const period = h >= 12 ? "PM" : "AM";
//     const display = h % 12 || 12;
//     return `${String(display).padStart(2, "0")}:${minute} ${period}`;
//   } catch {
//     return iso;
//   }
// }

// function isoToDateInput(iso: string) {
//   try {
//     return iso.split("T")[0];
//   } catch {
//     return "";
//   }
// }

// function isoToTimeInput(iso: string) {
//   try {
//     const timePart = iso.includes("T") ? iso.split("T")[1] : iso;
//     const [hour, minute] = timePart.split(":");
//     return `${hour.padStart(2, "0")}:${minute}`;
//   } catch {
//     return "";
//   }
// }

// // ── CalendarPicker ──────────────────────────────────────────────
// function CalendarPicker({
//   selectedDate,
//   onSelect,
//   onClose,
//   activeDates,
// }: {
//   selectedDate: string;
//   onSelect: (date: string) => void;
//   onClose: () => void;
//   activeDates: Set<string>;
// }) {
//   const [viewYear, setViewYear] = useState(() =>
//     parseInt(selectedDate.split("-")[0]),
//   );
//   const [viewMonth, setViewMonth] = useState(
//     () => parseInt(selectedDate.split("-")[1]) - 1,
//   );
//   const MONTHS = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
//   ];
//   const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
//   const firstDay = new Date(viewYear, viewMonth, 1).getDay();
//   const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

//   const cells = [
//     ...Array(firstDay).fill(null),
//     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
//   ];

//   return (
//     <div
//       className="absolute inset-0 z-[60] flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//       <div
//         className="relative bg-white rounded-3xl shadow-2xl p-5 w-full max-w-[280px]"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={() => setViewMonth((m) => (m === 0 ? 11 : m - 1))}
//             className="p-2 rounded-xl hover:bg-gray-100"
//           >
//             <ChevronLeft size={16} />
//           </button>
//           <span className="font-extrabold text-sm text-gray-800">
//             {MONTHS[viewMonth]} {viewYear}
//           </span>
//           <button
//             onClick={() => setViewMonth((m) => (m === 11 ? 0 : m + 1))}
//             className="p-2 rounded-xl hover:bg-gray-100"
//           >
//             <ChevronRight size={16} />
//           </button>
//         </div>
//         <div className="grid grid-cols-7 mb-1 text-[10px] font-bold text-gray-400 text-center">
//           {DAYS.map((d) => (
//             <div key={d}>{d}</div>
//           ))}
//         </div>
//         <div className="grid grid-cols-7 gap-y-1">
//           {cells.map((day, i) => {
//             if (!day) return <div key={i} />;
//             const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//             const isSelected = dateStr === selectedDate;
//             const hasSession = activeDates.has(dateStr);

//             return (
//               <button
//                 key={i}
//                 onClick={() => {
//                   onSelect(dateStr);
//                   onClose();
//                 }}
//                 className={`h-8 w-8 mx-auto rounded-lg text-xs font-bold transition flex flex-col items-center justify-center gap-[2px]
//                   ${isSelected ? "bg-[#20BEF9] text-white" : "hover:bg-blue-50 text-gray-700"}`}
//               >
//                 <span>{day}</span>
//                 {hasSession && (
//                   <span
//                     className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-[#20BEF9]"}`}
//                   />
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── EditForm ────────────────────────────────────────────────────
// function EditForm({
//   section,
//   teachers,
//   loadingTeachers,
//   onClose,
//   onSuccess,
// }: any) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [form, setForm] = useState({
//     title: section.title,
//     sessionDate: isoToDateInput(section.StartTime),
//     startTime: isoToTimeInput(section.StartTime),
//     endTime: isoToTimeInput(section.endTime),
//     capacity: String(section.capacity),
//     teacherId: section.teacherId,
//   });

//   const set = (e: any) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = {
//         title: form.title,
//         teacherId: form.teacherId,
//         StartTime: `${form.sessionDate}T${form.startTime}:00`,
//         endTime: `${form.sessionDate}T${form.endTime}:00`,
//         capacity: form.capacity,
//       };
//       const res = await fetch(
//         `${BACKEND_URL}/api/admin/patch.session/${section.id}`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );
//       if (!res.ok) throw new Error("Update failed");
//       onSuccess();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputCls = "bg-transparent outline-none text-sm w-full font-bold";

//   return (
//     <form onSubmit={handleSave} className="flex flex-col gap-3">
//       <div className="flex items-center gap-3 mb-1">
//         <button type="button" onClick={onClose} className="text-[#20BEF9]">
//           <ArrowLeft size={20} />
//         </button>
//         <h2 className="font-extrabold text-lg">Edit Session</h2>
//       </div>
//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-2 flex flex-col">
//         <label className="text-[10px] font-extrabold text-gray-400">
//           SESSION NAME
//         </label>
//         <input
//           type="text"
//           name="title"
//           value={form.title}
//           onChange={set}
//           required
//           className={inputCls}
//         />
//       </div>
//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-2 flex flex-col">
//         <label className="text-[10px] font-extrabold text-gray-400">
//           TEACHER
//         </label>
//         <select
//           name="teacherId"
//           value={form.teacherId}
//           onChange={set}
//           className={inputCls}
//         >
//           {teachers.map((t: any) => (
//             <option key={t.id} value={t.id}>
//               {t.fullName}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="flex gap-2">
//         <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-2 flex flex-col">
//           <label className="text-[10px] font-extrabold text-gray-400">
//             START
//           </label>
//           <input
//             type="time"
//             name="startTime"
//             value={form.startTime}
//             onChange={set}
//             className={inputCls}
//           />
//         </div>
//         <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-2 flex flex-col">
//           <label className="text-[10px] font-extrabold text-gray-400">
//             END
//           </label>
//           <input
//             type="time"
//             name="endTime"
//             value={form.endTime}
//             onChange={set}
//             className={inputCls}
//           />
//         </div>
//       </div>
//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-[#20BEF9] text-white font-extrabold py-4 rounded-xl mt-2 flex justify-center"
//       >
//         {loading ? (
//           <Loader2 className="animate-spin" size={20} />
//         ) : (
//           "SAVE CHANGES"
//         )}
//       </button>
//     </form>
//   );
// }

// // ── SessionCard ────────────────────────────────────────────────
// function SessionCard({
//   section,
//   onEdit,
// }: {
//   section: Section;
//   onEdit: () => void;
// }) {
//   const bookings = section.bookings?.length ?? 0;
//   const cap = section.capacity;
//   const cancelled = !section.status;
//   const color = cancelled ? "#fca5a5" : bookings >= cap ? "#f59e0b" : "#20BEF9";
//   const fillPct = Math.min((bookings / cap) * 100, 100);

//   return (
//     <div
//       className="bg-white rounded-2xl p-4 shadow-sm border-l-4"
//       style={{ borderLeftColor: color }}
//     >
//       <p className="text-[10px] font-bold mb-1" style={{ color: "#20BEF9" }}>
//         {formatTime(section.StartTime)} - {formatTime(section.endTime)}
//       </p>
//       <div className="flex items-start justify-between">
//         <h3
//           className={`font-extrabold text-lg leading-tight ${cancelled ? "text-gray-300" : "text-gray-800"}`}
//         >
//           {section.title}
//         </h3>
//         {!cancelled && (
//           <button
//             onClick={onEdit}
//             className="bg-gray-50 p-2 rounded-xl text-gray-400"
//           >
//             <PencilIcon size={14} />
//           </button>
//         )}
//       </div>
//       <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
//         <span className="flex items-center gap-1">
//           <User size={12} />
//           {section.teacher?.fullName || "—"}
//         </span>
//         <span className="flex items-center gap-1">
//           <Users size={12} />
//           {bookings}/{cap} Bookings
//         </span>
//       </div>
//       <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//         <div
//           className="h-full transition-all duration-500"
//           style={{ width: `${fillPct}%`, backgroundColor: color }}
//         />
//       </div>
//     </div>
//   );
// }

// // ── Main Component ──────────────────────────────────────────────
// export default function Session() {
//   const [sections, setSections] = useState<Section[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(
//     () => new Date().toISOString().split("T")[0],
//   );
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [sheet, setSheet] = useState<null | "create" | Section>(null);
//   const [visible, setVisible] = useState(false);

//   const fetchSections = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${BACKEND_URL}/api/admin-section`);
//       const data = await res.json();
//       const list = data.sections || data.data || data || [];
//       const full = await Promise.all(
//         list.map(async (s: Section) => {
//           try {
//             const r = await fetch(`${BACKEND_URL}/api/admin-section/${s.id}`);
//             const d = await r.json();
//             return { ...s, bookings: (d.section || d).bookings || [] };
//           } catch {
//             return { ...s, bookings: [] };
//           }
//         }),
//       );
//       setSections(full);
//     } catch {
//       setSections([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       const res = await fetch(`${BACKEND_URL}/api/admin/teachers`);
//       const data = await res.json();
//       setTeachers(Array.isArray(data) ? data : []);
//     } catch {
//       setTeachers([]);
//     }
//   };

//   useEffect(() => {
//     fetchSections();
//     fetchTeachers();
//   }, []);

//   const openSheet = (s: any) => {
//     setSheet(s);
//     setTimeout(() => setVisible(true), 10);
//   };
//   const closeSheet = () => {
//     setVisible(false);
//     setTimeout(() => setSheet(null), 350);
//   };

//   const filtered = sections.filter(
//     (s) => isoToDateInput(s.StartTime) === selectedDate,
//   );
//   const activeDates = new Set(sections.map((s) => isoToDateInput(s.StartTime)));

//   return (
//     <div className="relative w-full min-h-full">
//       {/* Date Selector */}
//       <div className="px-5 py-4">
//         <button
//           onClick={() => setShowCalendar(true)}
//           className="flex items-center gap-2 bg-[#E0F8FF] text-[#006688] font-bold text-xs px-4 py-2 rounded-full"
//         >
//           <CalendarIcon size={14} />
//           {selectedDate} <span className="text-[10px]">▾</span>
//         </button>
//       </div>

//       {/* Info Card */}
//       <div className="mx-5 mb-5 bg-[#E0F8FF] rounded-2xl px-4 py-3 flex items-start gap-2 border border-[#A8E6FA]">
//         <Info className="h-4 w-4 text-[#006688] shrink-0 mt-0.5" />
//         <p className="text-[10px] text-[#006688] font-medium leading-relaxed">
//           <span className="font-extrabold uppercase">Auto-Cancel:</span>{" "}
//           Sessions with under 3 participants 48h before start will be closed.
//         </p>
//       </div>

//       {/* Title & Add Button */}
//       <div className="px-5 flex items-center justify-between mb-5">
//         <div>
//           <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">
//             Sessions
//           </h2>
//           <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
//             Schedule List
//           </p>
//         </div>
//         <button
//           onClick={() => openSheet("create")}
//           className="bg-[#20BEF9] text-white rounded-2xl p-3 shadow-lg active:scale-90 transition"
//         >
//           <Plus size={24} />
//         </button>
//       </div>

//       {/* Sessions List */}
//       <div className="px-5 flex flex-col gap-3">
//         {loading ? (
//           <div className="py-20 flex justify-center">
//             <Loader2 className="animate-spin text-[#20BEF9]" size={32} />
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="py-20 text-center text-gray-300 font-bold text-sm uppercase tracking-widest">
//             No Sessions Found
//           </div>
//         ) : (
//           filtered.map((s) => (
//             <SessionCard key={s.id} section={s} onEdit={() => openSheet(s)} />
//           ))
//         )}
//       </div>

//       {/* Calendar Modal */}
//       {showCalendar && (
//         <CalendarPicker
//           selectedDate={selectedDate}
//           onSelect={setSelectedDate}
//           onClose={() => setShowCalendar(false)}
//           activeDates={activeDates}
//         />
//       )}

//       {/* Bottom Sheet */}
//       {sheet && (
//         <>
//           <div
//             onClick={closeSheet}
//             className={`absolute inset-0 z-40 transition-opacity duration-300 bg-black/40 ${visible ? "opacity-100" : "opacity-0"}`}
//           />
//           <div
//             className={`absolute bottom-0 left-0 right-0 z-50 bg-[#E0F8FF] rounded-t-[32px] px-6 pt-2 pb-10 transition-transform duration-500 ease-out shadow-2xl
//             ${visible ? "translate-y-0" : "translate-y-full"}`}
//           >
//             <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
//             {sheet === "create" ? (
//               <CreateSession
//                 onClose={closeSheet}
//                 onSuccess={() => {
//                   fetchSections();
//                   closeSheet();
//                 }}
//                 defaultDate={selectedDate}
//               />
//             ) : (
//               <EditForm
//                 section={sheet}
//                 teachers={teachers}
//                 onClose={closeSheet}
//                 onSuccess={() => {
//                   fetchSections();
//                   closeSheet();
//                 }}
//               />
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  Loader2,
  ArrowLeft,
  Plus,
  Users,
  User,
  PencilIcon,
  Info,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react";
import CreateSession from "./CreateSession";
import {
  formatSessionTime,
  getSessionDateInputValue,
  getSessionTimeInputValue,
  getSessionToday,
  toSessionISOString,
} from "@/app/admin/lib/session-time";

interface Teacher {
  id: string;
  fullName: string;
}

interface Booking {
  id: string;
  clerkId: string;
  sectionId: string;
  status: boolean;
  isTrial: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  title: string;
  level: string;
  teacherId: string;
  teacher?: { fullName: string };
  StartTime: string;
  endTime: string;
  capacity: number;
  status: boolean;
  bookings?: Booking[];
}

const BACKEND_URL = "https://tokalot.vercel.app";

function formatTime(iso: string) {
  return formatSessionTime(iso);
}

function isoToDateInput(iso: string) {
  return getSessionDateInputValue(iso);
}

function isoToTimeInput(iso: string) {
  return getSessionTimeInputValue(iso);
}

// ── CalendarPicker ──────────────────────────────────────────────
function CalendarPicker({
  selectedDate,
  onSelect,
  onClose,
  activeDates,
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
  activeDates: Set<string>;
}) {
  const [viewYear, setViewYear] = useState(() =>
    parseInt(selectedDate.split("-")[0]),
  );
  const [viewMonth, setViewMonth] = useState(
    () => parseInt(selectedDate.split("-")[1]) - 1,
  );
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
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl p-5 w-full max-w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setViewMonth((m) => (m === 0 ? 11 : m - 1))}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-extrabold text-sm text-gray-800">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={() => setViewMonth((m) => (m === 11 ? 0 : m + 1))}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1 text-[10px] font-bold text-gray-400 text-center">
          {DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = dateStr === selectedDate;
            const hasSession = activeDates.has(dateStr);

            return (
              <button
                key={i}
                onClick={() => {
                  onSelect(dateStr);
                  onClose();
                }}
                className={`h-8 w-8 mx-auto rounded-lg text-xs font-bold transition flex flex-col items-center justify-center gap-[2px]
                  ${isSelected ? "bg-[#20BEF9] text-white" : "hover:bg-blue-50 text-gray-700"}`}
              >
                <span>{day}</span>
                {hasSession && (
                  <span
                    className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-[#20BEF9]"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── BookingsPopup ───────────────────────────────────────────────
function BookingsPopup({
  bookings,
  onClose,
}: {
  bookings: Booking[];
  onClose: () => void;
}) {
  // Only show active bookings (status: true)
  const activeBookings = bookings.filter((b) => b.status);

  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl p-5 w-full max-w-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base text-gray-800">
            Бүртгэлтэй хүмүүс
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {activeBookings.length === 0 ? (
          <p className="text-center text-gray-400 font-bold text-sm py-4">
            Бүртгэлтэй хүн байхгүй
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeBookings.map((booking, idx) => (
              <div
                key={booking.id}
                className="flex items-center gap-3 bg-[#E0F8FF] rounded-xl px-3 py-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-[#20BEF9] flex items-center justify-center shrink-0">
                  <User size={14} className="text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Суралцагч {idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-gray-700 truncate">
                    {booking.clerkId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── DeleteConfirmPopup ──────────────────────────────────────────
function DeleteConfirmPopup({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div
      className="absolute inset-0 z-[70] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-[280px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <h3 className="font-extrabold text-base text-gray-800 text-center">
            Устгахдаа итгэлтэй байна уу?
          </h3>
          <p className="text-xs text-gray-400 font-medium text-center leading-relaxed">
            Энэ үйлдлийг буцаах боломжгүй. Session бүрмөсөн устна.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-600 font-extrabold py-3 rounded-xl text-sm"
          >
            Болих
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Устгах"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EditForm ────────────────────────────────────────────────────
function EditForm({ section, teachers, onClose, onSuccess, onDeleted }: any) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    title: section.title,
    sessionDate: isoToDateInput(section.StartTime),
    startTime: isoToTimeInput(section.StartTime),
    endTime: isoToTimeInput(section.endTime),
    capacity: String(section.capacity),
    teacherId: section.teacherId,
  });

  const set = (e: any) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        teacherId: form.teacherId,
        StartTime: toSessionISOString(form.sessionDate, form.startTime),
        endTime: toSessionISOString(form.sessionDate, form.endTime),
        capacity: form.capacity,
      };
      const res = await fetch(
        `${BACKEND_URL}/api/admin/patch.session/${section.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/delete.session/${section.id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      onDeleted();
    } catch (err: any) {
      setError(err.message);
      setShowDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const inputCls = "bg-transparent outline-none text-sm w-full font-bold";

  return (
    <>
      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <div className="flex items-center gap-3 mb-1">
          <button type="button" onClick={onClose} className="text-[#20BEF9]">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-extrabold text-lg">Edit Session</h2>
        </div>
        <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-2 flex flex-col">
          <label className="text-[10px] font-extrabold text-gray-400">
            SESSION NAME
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={set}
            required
            className={inputCls}
          />
        </div>
        <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-2 flex flex-col">
          <label className="text-[10px] font-extrabold text-gray-400">
            TEACHER
          </label>
          <select
            name="teacherId"
            value={form.teacherId}
            onChange={set}
            className={inputCls}
          >
            {teachers.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.fullName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-2 flex flex-col">
            <label className="text-[10px] font-extrabold text-gray-400">
              START
            </label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={set}
              className={inputCls}
            />
          </div>
          <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-2 flex flex-col">
            <label className="text-[10px] font-extrabold text-gray-400">
              END
            </label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={set}
              className={inputCls}
            />
          </div>
        </div>

        {error ? (
          <p className="text-xs text-red-500 font-bold text-center">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#20BEF9] text-white font-extrabold py-4 rounded-xl mt-1 flex justify-center"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "SAVE CHANGES"
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-500 font-extrabold py-3.5 rounded-xl"
        >
          <Trash2 size={16} />
          DELETE SESSION
        </button>
      </form>

      {showDeleteConfirm && (
        <DeleteConfirmPopup
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={deleteLoading}
        />
      )}
    </>
  );
}

// ── SessionCard ────────────────────────────────────────────────
function SessionCard({
  section,
  onEdit,
}: {
  section: Section;
  onEdit: () => void;
}) {
  const [showBookings, setShowBookings] = useState(false);

  // Only count active bookings (status: true)
  const activeBookings = section.bookings?.filter((b) => b.status) ?? [];
  const bookings = activeBookings.length;
  const cap = section.capacity;
  const cancelled = !section.status;
  const color = cancelled ? "#fca5a5" : bookings >= cap ? "#f59e0b" : "#20BEF9";
  const fillPct = Math.min((bookings / cap) * 100, 100);

  return (
    <>
      <div
        className="bg-white rounded-2xl p-4 shadow-sm border-l-4"
        style={{ borderLeftColor: color }}
      >
        <p className="text-[10px] font-bold mb-1" style={{ color: "#20BEF9" }}>
          {formatTime(section.StartTime)} - {formatTime(section.endTime)}
        </p>
        <div className="flex items-start justify-between">
          <h3
            className={`font-extrabold text-lg leading-tight ${cancelled ? "text-gray-300" : "text-gray-800"}`}
          >
            {section.title}
          </h3>
          {!cancelled && (
            <button
              onClick={onEdit}
              className="bg-gray-50 p-2 rounded-xl text-gray-400"
            >
              <PencilIcon size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <User size={12} />
            {section.teacher?.fullName || "—"}
          </span>
          {/* Clickable bookings count */}
          <button
            onClick={() => setShowBookings(true)}
            className="flex items-center gap-1 hover:text-[#20BEF9] transition-colors"
          >
            <Users size={12} />
            {bookings}/{cap} Bookings
          </button>
        </div>
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${fillPct}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {showBookings && (
        <BookingsPopup
          bookings={section.bookings ?? []}
          onClose={() => setShowBookings(false)}
        />
      )}
    </>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function Session() {
  const [sections, setSections] = useState<Section[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => getSessionToday());
  const [showCalendar, setShowCalendar] = useState(false);
  const [sheet, setSheet] = useState<null | "create" | Section>(null);
  const [visible, setVisible] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin-section`);
      const data = await res.json();
      const list = data.sections || data.data || data || [];
      const full = await Promise.all(
        list.map(async (s: Section) => {
          try {
            const r = await fetch(`${BACKEND_URL}/api/admin-section/${s.id}`);
            const d = await r.json();
            return { ...s, bookings: (d.section || d).bookings || [] };
          } catch {
            return { ...s, bookings: [] };
          }
        }),
      );
      setSections(full);
    } catch {
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/teachers`);
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch {
      setTeachers([]);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchTeachers();
  }, []);

  const openSheet = (s: any) => {
    setSheet(s);
    setTimeout(() => setVisible(true), 10);
  };
  const closeSheet = () => {
    setVisible(false);
    setTimeout(() => setSheet(null), 350);
  };

  const filtered = sections.filter(
    (s) => isoToDateInput(s.StartTime) === selectedDate,
  );
  const activeDates = new Set(sections.map((s) => isoToDateInput(s.StartTime)));

  return (
    <div className="relative w-full min-h-full">
      {/* Date Selector */}
      <div className="px-5 py-4">
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 bg-[#E0F8FF] text-[#006688] font-bold text-xs px-4 py-2 rounded-full"
        >
          <CalendarIcon size={14} />
          {selectedDate} <span className="text-[10px]">▾</span>
        </button>
      </div>

      {/* Info Card */}
      <div className="mx-5 mb-5 bg-[#E0F8FF] rounded-2xl px-4 py-3 flex items-start gap-2 border border-[#A8E6FA]">
        <Info className="h-4 w-4 text-[#006688] shrink-0 mt-0.5" />
        <p className="text-[10px] text-[#006688] font-medium leading-relaxed">
          <span className="font-extrabold uppercase">Auto-Cancel:</span>{" "}
          Sessions with under 3 participants 48h before start will be closed.
        </p>
      </div>

      {/* Title & Add Button */}
      <div className="px-5 flex items-center justify-between mb-5">
        <div>
          <h2 className="font-extrabold text-2xl text-gray-900 leading-tight">
            Sessions
          </h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
            Schedule List
          </p>
        </div>
        <button
          onClick={() => openSheet("create")}
          className="bg-[#20BEF9] text-white rounded-2xl p-3 shadow-lg active:scale-90 transition"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Sessions List */}
      <div className="px-5 flex flex-col gap-3">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-[#20BEF9]" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-300 font-bold text-sm uppercase tracking-widest">
            No Sessions Found
          </div>
        ) : (
          filtered.map((s) => (
            <SessionCard key={s.id} section={s} onEdit={() => openSheet(s)} />
          ))
        )}
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <CalendarPicker
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          onClose={() => setShowCalendar(false)}
          activeDates={activeDates}
        />
      )}

      {/* Bottom Sheet */}
      {sheet && (
        <>
          <div
            onClick={closeSheet}
            className={`absolute inset-0 z-40 transition-opacity duration-300 bg-black/40 ${visible ? "opacity-100" : "opacity-0"}`}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 z-50 bg-[#E0F8FF] rounded-t-[32px] px-6 pt-2 pb-10 transition-transform duration-500 ease-out shadow-2xl
            ${visible ? "translate-y-0" : "translate-y-full"}`}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            {sheet === "create" ? (
              <CreateSession
                onClose={closeSheet}
                onSuccess={() => {
                  fetchSections();
                  closeSheet();
                }}
                defaultDate={selectedDate}
              />
            ) : (
              <EditForm
                section={sheet}
                teachers={teachers}
                onClose={closeSheet}
                onSuccess={() => {
                  fetchSections();
                  closeSheet();
                }}
                onDeleted={() => {
                  fetchSections();
                  closeSheet();
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
