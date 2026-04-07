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
//   enrolledCount?: number;
// }

// const BACKEND_URL = "https://tokalot.vercel.app";

// function formatTime(iso: string) {
//   try {
//     const timePart = iso.includes("T") ? iso.split("T")[1] : iso;
//     const [hourStr, minuteStr] = timePart.split(":");
//     const hour = parseInt(hourStr, 10);
//     const minute = minuteStr;
//     const ampm = hour >= 12 ? "PM" : "AM";
//     const h12 = hour % 12 === 0 ? 12 : hour % 12;
//     return `${String(h12).padStart(2, "0")}:${minute} ${ampm}`;
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
//     return `${hour}:${minute}`;
//   } catch {
//     return "";
//   }
// }

// // ── Calendar Picker ──────────────────────────────────────────────
// function CalendarPicker({
//   selectedDate,
//   onSelect,
//   onClose,
//   activeDates,
// }: {
//   selectedDate: string; // "YYYY-MM-DD"
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
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

//   const firstDay = new Date(viewYear, viewMonth, 1).getDay();
//   const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

//   const prevMonth = () => {
//     if (viewMonth === 0) {
//       setViewMonth(11);
//       setViewYear((y) => y - 1);
//     } else setViewMonth((m) => m - 1);
//   };
//   const nextMonth = () => {
//     if (viewMonth === 11) {
//       setViewMonth(0);
//       setViewYear((y) => y + 1);
//     } else setViewMonth((m) => m + 1);
//   };

//   const cells: (number | null)[] = [
//     ...Array(firstDay).fill(null),
//     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
//   ];

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/40" />
//       <div
//         className="relative bg-white rounded-3xl shadow-2xl p-5 w-80"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={prevMonth}
//             className="p-2 rounded-xl hover:bg-gray-100"
//           >
//             <ChevronLeft className="h-4 w-4 text-gray-600" />
//           </button>
//           <span className="font-extrabold text-gray-800">
//             {MONTHS[viewMonth]} {viewYear}
//           </span>
//           <button
//             onClick={nextMonth}
//             className="p-2 rounded-xl hover:bg-gray-100"
//           >
//             <ChevronRight className="h-4 w-4 text-gray-600" />
//           </button>
//         </div>

//         {/* Day labels */}
//         <div className="grid grid-cols-7 mb-1">
//           {DAYS.map((d) => (
//             <div
//               key={d}
//               className="text-center text-xs font-bold text-gray-400 py-1"
//             >
//               {d}
//             </div>
//           ))}
//         </div>

//         {/* Date cells */}
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
//                 className={`relative flex flex-col items-center justify-center h-9 w-9 mx-auto rounded-xl text-sm font-bold transition
//                   ${isSelected ? "bg-[#20BEF9] text-white" : "hover:bg-[#E0F8FF] text-gray-700"}`}
//               >
//                 {day}
//                 {hasSession && (
//                   <span
//                     className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-[#20BEF9]"}`}
//                   />
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* Today button */}
//         <button
//           onClick={() => {
//             const t = new Date();
//             const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
//             onSelect(todayStr);
//             onClose();
//           }}
//           className="mt-4 w-full py-2.5 rounded-xl bg-[#E0F8FF] text-[#006688] font-extrabold text-sm tracking-widest"
//         >
//           TODAY
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── EditForm ─────────────────────────────────────────────────────
// function EditForm({
//   section,
//   teachers,
//   loadingTeachers,
//   onClose,
//   onSuccess,
// }: {
//   section: Section;
//   teachers: Teacher[];
//   loadingTeachers: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }) {
//   const [loading, setLoading] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [error, setError] = useState("");
//   const [form, setForm] = useState({
//     title: section.title,
//     sessionDate: isoToDateInput(section.StartTime),
//     startTime: isoToTimeInput(section.StartTime),
//     endTime: isoToTimeInput(section.endTime),
//     capacity: String(section.capacity),
//     teacherId: section.teacherId,
//   });

//   const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (form.endTime <= form.startTime) {
//       setError("End time нь start time-аас хожуу байх ёстой.");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       const payload = {
//         title: form.title,
//         level: section.level || "Beginner",
//         teacherId: form.teacherId,
//         startTime: `${form.sessionDate}T${form.startTime}:00`,
//         endTime: `${form.sessionDate}T${form.endTime}:00`,
//         capacity: Number(form.capacity),
//       };
//       const res = await fetch(
//         `${BACKEND_URL}/api/admin/patch.session/${section.id}`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(
//           err.message || err.error || `Server error: ${res.status}`,
//         );
//       }
//       onSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Алдаа гарлаа");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("Энэ session-г устгах уу?")) return;
//     setDeleting(true);
//     setError("");
//     try {
//       const res = await fetch(
//         `${BACKEND_URL}/api/admin/delete.session/${section.id}`,
//         { method: "DELETE" },
//       );
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       onSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Устгахад алдаа гарлаа");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const inputCls = "bg-transparent outline-none text-sm w-full";

//   return (
//     <form onSubmit={handleSave} className="flex flex-col gap-3">
//       <div className="flex items-center gap-3 mb-1">
//         <button type="button" onClick={onClose} className="text-[#20BEF9]">
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <div className="bg-[#C2E8FF] p-2 rounded-xl">
//           <CalendarIcon className="h-5 w-5 text-[#006688]" />
//         </div>
//         <h2 className="font-extrabold text-lg">Edit Session</h2>
//       </div>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
//           ⚠️ {error}
//         </div>
//       )}

//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
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

//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           SESSION DATE
//         </label>
//         <input
//           type="date"
//           name="sessionDate"
//           value={form.sessionDate}
//           onChange={set}
//           required
//           className={inputCls}
//         />
//       </div>

//       <div className="flex gap-3">
//         <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             START TIME
//           </label>
//           <input
//             type="time"
//             name="startTime"
//             value={form.startTime}
//             onChange={set}
//             required
//             className={inputCls}
//           />
//         </div>
//         <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             END TIME
//           </label>
//           <input
//             type="time"
//             name="endTime"
//             value={form.endTime}
//             onChange={set}
//             required
//             className={inputCls}
//           />
//         </div>
//       </div>

//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           SEATS
//         </label>
//         <input
//           type="number"
//           name="capacity"
//           value={form.capacity}
//           onChange={set}
//           min="1"
//           className={inputCls}
//         />
//       </div>

//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           TEACHER
//         </label>
//         <select
//           name="teacherId"
//           value={form.teacherId}
//           onChange={set}
//           required
//           disabled={loadingTeachers}
//           className={`${inputCls} text-gray-700`}
//         >
//           {teachers.map((t) => (
//             <option key={t.id} value={t.id}>
//               {t.fullName}
//             </option>
//           ))}
//         </select>
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
//       >
//         {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//         {loading ? "SAVING..." : "SAVE SESSION"}
//       </button>

//       <button
//         type="button"
//         onClick={handleDelete}
//         disabled={deleting}
//         className="border-2 border-red-400 text-red-500 font-extrabold tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 bg-white"
//       >
//         {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
//         {deleting ? "DELETING..." : "DELETE SESSION"}
//       </button>
//     </form>
//   );
// }

// // ── SessionCard ───────────────────────────────────────────────────
// function SessionCard({
//   section,
//   onEdit,
// }: {
//   section: Section;
//   onEdit: () => void;
// }) {
//   const enrolled = section.enrolledCount ?? 0;
//   const cap = section.capacity;
//   const cancelled = !section.status;
//   const fullyBooked = !cancelled && enrolled >= cap;
//   const fillPct = Math.min((enrolled / cap) * 100, 100);
//   const color = cancelled ? "#fca5a5" : enrolled >= cap ? "#f59e0b" : "#20BEF9";

//   return (
//     <div
//       className="bg-white rounded-2xl p-4 shadow-sm"
//       style={{ borderLeft: `4px solid ${color}` }}
//     >
//       <p className="text-xs font-bold mb-1" style={{ color: "#20BEF9" }}>
//         {formatTime(section.StartTime)} - {formatTime(section.endTime)}
//       </p>
//       <div className="flex items-start justify-between gap-2">
//         <h3
//           className={`font-extrabold text-[20px] leading-tight ${cancelled ? "text-gray-400" : "text-gray-800"}`}
//         >
//           {section.title}
//         </h3>
//         {cancelled ? (
//           <Lock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
//         ) : (
//           <button
//             onClick={onEdit}
//             className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-xl transition flex-shrink-0"
//           >
//             <PencilIcon className="h-3.5 w-3.5 text-gray-500" />
//           </button>
//         )}
//       </div>

//       <div className="flex items-center gap-4 mt-2">
//         <span className="flex items-center gap-1 text-sm text-gray-500">
//           <User className="h-3.5 w-3.5" />
//           {section.teacher?.fullName ?? "—"}
//         </span>
//         <span className="flex items-center gap-1 text-sm text-gray-500">
//           <Users className="h-3.5 w-3.5" />
//           {enrolled}/{cap} Seats
//         </span>
//       </div>

//       <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//         <div
//           className="h-full rounded-full transition-all duration-500"
//           style={{ width: `${fillPct}%`, backgroundColor: color }}
//         />
//       </div>

//       {fullyBooked && (
//         <div className="mt-2">
//           <span className="text-xs font-extrabold tracking-widest px-3 py-1 rounded-full border border-amber-300 text-amber-600 bg-amber-50">
//             FULLY BOOKED
//           </span>
//         </div>
//       )}

//       {cancelled && (
//         <div className="mt-2 flex items-center gap-1">
//           <span className="text-red-400 text-sm">⊗</span>
//           <span className="text-xs font-extrabold tracking-widest text-red-400">
//             CANCELLED (LOW ATTENDANCE)
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main ──────────────────────────────────────────────────────────
// export default function Session() {
//   const todayObj = new Date();
//   const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

//   const [sections, setSections] = useState<Section[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loadingSections, setLoadingSections] = useState(true);
//   const [loadingTeachers, setLoadingTeachers] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(todayStr);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [sheet, setSheet] = useState<null | "create" | Section>(null);
//   const [visible, setVisible] = useState(false);
//   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const openSheet = (s: "create" | Section) => {
//     if (timer.current) clearTimeout(timer.current);
//     setSheet(s);
//     requestAnimationFrame(() => setVisible(true));
//   };

//   const closeSheet = () => {
//     setVisible(false);
//     timer.current = setTimeout(() => setSheet(null), 350);
//   };

//   useEffect(
//     () => () => {
//       if (timer.current) clearTimeout(timer.current);
//     },
//     [],
//   );

//   const fetchSections = async () => {
//     try {
//       setLoadingSections(true);
//       const res = await fetch(`${BACKEND_URL}/api/admin-section`);
//       if (!res.ok) throw new Error("failed");
//       const data = await res.json();
//       setSections(Array.isArray(data) ? data : []);
//     } catch {
//       setSections([]);
//     } finally {
//       setLoadingSections(false);
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       setLoadingTeachers(true);
//       const res = await fetch(`${BACKEND_URL}/api/admin/teachers`);
//       if (!res.ok) throw new Error("failed");
//       const data = await res.json();
//       setTeachers(Array.isArray(data) ? data : []);
//     } catch {
//       setTeachers([]);
//     } finally {
//       setLoadingTeachers(false);
//     }
//   };

//   useEffect(() => {
//     fetchSections();
//     fetchTeachers();
//   }, []);

//   const handleSuccess = () => {
//     closeSheet();
//     setTimeout(fetchSections, 400);
//   };

//   // Сонгосон өдрөөр шүүнэ
//   const filteredSections = sections.filter(
//     (s) => isoToDateInput(s.StartTime) === selectedDate,
//   );

//   // Calendar дээр цэг харуулах өдрүүд
//   const activeDates = new Set(sections.map((s) => isoToDateInput(s.StartTime)));

//   // Header дээр харуулах label
//   const MONTHS = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const [selYear, selMonth] = selectedDate.split("-").map(Number);
//   const headerLabel = `${MONTHS[selMonth - 1]} ${selYear}`;

//   // Сонгосон өдрийн label
//   const selDateObj = new Date(`${selectedDate}T00:00:00`);
//   const dateLabel = selDateObj.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "short",
//     day: "numeric",
//   });

//   return (
//     <div className="relative">
//       {/* Month picker button */}
//       <div className="px-5 py-3">
//         <button
//           onClick={() => setShowCalendar(true)}
//           className="flex items-center gap-2 bg-[#E0F8FF] text-[#006688] font-bold text-sm px-4 py-2 rounded-full"
//         >
//           <CalendarIcon className="h-4 w-4" />
//           {headerLabel}
//           <span className="text-xs">▾</span>
//         </button>
//       </div>

//       {/* Calendar modal */}
//       {showCalendar && (
//         <CalendarPicker
//           selectedDate={selectedDate}
//           onSelect={setSelectedDate}
//           onClose={() => setShowCalendar(false)}
//           activeDates={activeDates}
//         />
//       )}

//       {/* Auto-cancellation notice */}
//       <div className="mx-5 mb-4 bg-[#E0F8FF] rounded-2xl px-4 py-3 flex items-start gap-2">
//         <Info className="h-4 w-4 text-[#006688] flex-shrink-0 mt-0.5" />
//         <p className="text-xs text-[#006688] leading-relaxed">
//           <span className="font-extrabold">Auto-Cancellation:</span> Sessions
//           with &lt;3 participants 48h before start are automatically cancelled
//           and closed.
//         </p>
//       </div>

//       {/* Title */}
//       <div className="px-5 flex items-center justify-between mb-4">
//         <div>
//           <h2 className="font-extrabold text-2xl text-gray-900">
//             {selectedDate === todayStr ? "Today's Sessions" : "Sessions"}
//           </h2>
//           <p className="text-sm text-gray-500">{dateLabel}</p>
//         </div>
//         <button
//           onClick={() => openSheet("create")}
//           className="bg-[#20BEF9] text-white rounded-2xl p-3 shadow-lg hover:bg-[#00aaee] transition active:scale-95"
//         >
//           <Plus className="h-6 w-6" />
//         </button>
//       </div>

//       {/* Session list */}
//       <div className="px-5 flex flex-col gap-3 pb-6">
//         {loadingSections ? (
//           <div className="flex justify-center py-16">
//             <Loader2 className="h-7 w-7 animate-spin text-[#20BEF9]" />
//           </div>
//         ) : filteredSections.length === 0 ? (
//           <div className="flex flex-col items-center py-16 gap-3">
//             <CalendarIcon className="h-10 w-10 text-gray-200" />
//             <p className="text-center text-gray-400 text-sm">
//               {dateLabel} дээр session байхгүй байна
//             </p>
//           </div>
//         ) : (
//           filteredSections.map((s) => (
//             <SessionCard key={s.id} section={s} onEdit={() => openSheet(s)} />
//           ))
//         )}
//       </div>

//       {/* Bottom sheet */}
//       {sheet !== null && (
//         <>
//           <div
//             onClick={closeSheet}
//             className="fixed inset-0 z-20 transition-opacity duration-300"
//             style={{
//               backgroundColor: visible ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
//             }}
//           />
//           <div
//             className="fixed left-0 right-0 bottom-0 z-30 bg-[#E0F8FF] rounded-t-3xl px-5 pt-3 pb-16 shadow-2xl overflow-y-auto max-h-[92vh]"
//             style={{
//               transform: visible ? "translateY(0)" : "translateY(100%)",
//               transition: "transform 350ms cubic-bezier(0.32,0.72,0,1)",
//             }}
//           >
//             <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
//             {sheet === "create" ? (
//               <CreateSession
//                 onClose={closeSheet}
//                 onSuccess={handleSuccess}
//                 defaultDate={selectedDate}
//               />
//             ) : (
//               <EditForm
//                 section={sheet as Section}
//                 teachers={teachers}
//                 loadingTeachers={loadingTeachers}
//                 onClose={closeSheet}
//                 onSuccess={handleSuccess}
//               />
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

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
//   StartTime: string; // Database field name
//   endTime: string; // Database field name
//   capacity: number;
//   status: boolean;
//   enrolledCount?: number;
// }

// const BACKEND_URL = "https://tokalot.vercel.app";

// function formatTime(iso: string) {
//   try {
//     const timePart = iso.includes("T") ? iso.split("T")[1] : iso;
//     const [hourStr, minuteStr] = timePart.split(":");
//     const hour = parseInt(hourStr, 10);
//     const minute = minuteStr;
//     const ampm = hour >= 12 ? "PM" : "AM";
//     const h12 = hour % 12 === 0 ? 12 : hour % 12;
//     return `${String(h12).padStart(2, "0")}:${minute} ${ampm}`;
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
//     return `${hour}:${minute}`;
//   } catch {
//     return "";
//   }
// }

// // ── Calendar Picker ──────────────────────────────────────────────
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
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

//   const firstDay = new Date(viewYear, viewMonth, 1).getDay();
//   const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

//   const prevMonth = () => {
//     if (viewMonth === 0) {
//       setViewMonth(11);
//       setViewYear((y) => y - 1);
//     } else setViewMonth((m) => m - 1);
//   };
//   const nextMonth = () => {
//     if (viewMonth === 11) {
//       setViewMonth(0);
//       setViewYear((y) => y + 1);
//     } else setViewMonth((m) => m + 1);
//   };

//   const cells: (number | null)[] = [
//     ...Array(firstDay).fill(null),
//     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
//   ];

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/40" />
//       <div
//         className="relative bg-white rounded-3xl shadow-2xl p-5 w-80"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between mb-4">
//           <button
//             onClick={prevMonth}
//             className="p-2 rounded-xl hover:bg-gray-100"
//           >
//             <ChevronLeft className="h-4 w-4 text-gray-600" />
//           </button>
//           <span className="font-extrabold text-gray-800">
//             {MONTHS[viewMonth]} {viewYear}
//           </span>
//           <button
//             onClick={nextMonth}
//             className="p-2 rounded-xl hover:bg-gray-100"
//           >
//             <ChevronRight className="h-4 w-4 text-gray-600" />
//           </button>
//         </div>
//         <div className="grid grid-cols-7 mb-1">
//           {DAYS.map((d) => (
//             <div
//               key={d}
//               className="text-center text-xs font-bold text-gray-400 py-1"
//             >
//               {d}
//             </div>
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
//                 className={`relative flex flex-col items-center justify-center h-9 w-9 mx-auto rounded-xl text-sm font-bold transition
//                   ${isSelected ? "bg-[#20BEF9] text-white" : "hover:bg-[#E0F8FF] text-gray-700"}`}
//               >
//                 {day}
//                 {hasSession && (
//                   <span
//                     className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-[#20BEF9]"}`}
//                   />
//                 )}
//               </button>
//             );
//           })}
//         </div>
//         <button
//           onClick={() => {
//             const t = new Date();
//             const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
//             onSelect(todayStr);
//             onClose();
//           }}
//           className="mt-4 w-full py-2.5 rounded-xl bg-[#E0F8FF] text-[#006688] font-extrabold text-sm tracking-widest"
//         >
//           TODAY
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── EditForm ─────────────────────────────────────────────────────
// function EditForm({
//   section,
//   teachers,
//   loadingTeachers,
//   onClose,
//   onSuccess,
// }: {
//   section: Section;
//   teachers: Teacher[];
//   loadingTeachers: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }) {
//   const [loading, setLoading] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [error, setError] = useState("");
//   const [form, setForm] = useState({
//     title: section.title,
//     sessionDate: isoToDateInput(section.StartTime),
//     startTime: isoToTimeInput(section.StartTime),
//     endTime: isoToTimeInput(section.endTime),
//     capacity: String(section.capacity),
//     teacherId: section.teacherId,
//   });

//   const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (form.endTime <= form.startTime) {
//       setError("Дуусах цаг эхлэх цагаас хожуу байх ёстой.");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       // Backend-ийн PATCH route-д хүлээж авч байгаа field-үүдтэй яг тааруулж байна
//       const payload = {
//         title: form.title,
//         level: section.level || "Beginner",
//         teacherId: form.teacherId, // Хэрэв backend-д teacherId нэмэгдсэн бол ажиллана
//         startTime: `${form.sessionDate}T${form.startTime}:00`, // Prisma StartTime-д очих утга
//         endTime: `${form.sessionDate}T${form.endTime}:00`,
//         capacity: form.capacity, // Backend parseInt хийж байгаа тул string байж болно
//         status: section.status,
//       };

//       const res = await fetch(
//         `${BACKEND_URL}/api/admin/patch.session/${section.id}`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );
//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.message || err.error || `Error: ${res.status}`);
//       }
//       onSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Алдаа гарлаа");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("Энэ session-г устгах уу?")) return;
//     setDeleting(true);
//     setError("");
//     try {
//       const res = await fetch(
//         `${BACKEND_URL}/api/admin/delete.session/${section.id}`,
//         { method: "DELETE" },
//       );
//       if (!res.ok) throw new Error(`Устгахад алдаа гарлаа: ${res.status}`);
//       onSuccess();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Алдаа гарлаа");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const inputCls = "bg-transparent outline-none text-sm w-full";

//   return (
//     <form onSubmit={handleSave} className="flex flex-col gap-3">
//       <div className="flex items-center gap-3 mb-1">
//         <button type="button" onClick={onClose} className="text-[#20BEF9]">
//           <ArrowLeft className="h-5 w-5" />
//         </button>
//         <div className="bg-[#C2E8FF] p-2 rounded-xl">
//           <CalendarIcon className="h-5 w-5 text-[#006688]" />
//         </div>
//         <h2 className="font-extrabold text-lg">Edit Session</h2>
//       </div>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
//           ⚠️ {error}
//         </div>
//       )}

//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
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

//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           SESSION DATE
//         </label>
//         <input
//           type="date"
//           name="sessionDate"
//           value={form.sessionDate}
//           onChange={set}
//           required
//           className={inputCls}
//         />
//       </div>

//       <div className="flex gap-3">
//         <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             START TIME
//           </label>
//           <input
//             type="time"
//             name="startTime"
//             value={form.startTime}
//             onChange={set}
//             required
//             className={inputCls}
//           />
//         </div>
//         <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             END TIME
//           </label>
//           <input
//             type="time"
//             name="endTime"
//             value={form.endTime}
//             onChange={set}
//             required
//             className={inputCls}
//           />
//         </div>
//       </div>

//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           SEATS
//         </label>
//         <input
//           type="number"
//           name="capacity"
//           value={form.capacity}
//           onChange={set}
//           min="1"
//           className={inputCls}
//         />
//       </div>

//       <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           TEACHER
//         </label>
//         <select
//           name="teacherId"
//           value={form.teacherId}
//           onChange={set}
//           required
//           disabled={loadingTeachers}
//           className={`${inputCls} text-gray-700`}
//         >
//           {teachers.map((t) => (
//             <option key={t.id} value={t.id}>
//               {t.fullName}
//             </option>
//           ))}
//         </select>
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
//       >
//         {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//         {loading ? "SAVING..." : "SAVE SESSION"}
//       </button>

//       <button
//         type="button"
//         onClick={handleDelete}
//         disabled={deleting}
//         className="border-2 border-red-400 text-red-500 font-extrabold tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 bg-white"
//       >
//         {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
//         {deleting ? "DELETING..." : "DELETE SESSION"}
//       </button>
//     </form>
//   );
// }

// // ── SessionCard ───────────────────────────────────────────────────
// function SessionCard({
//   section,
//   onEdit,
// }: {
//   section: Section;
//   onEdit: () => void;
// }) {
//   const enrolled = section.enrolledCount ?? 0;
//   const cap = section.capacity;
//   const cancelled = !section.status;
//   const fullyBooked = !cancelled && enrolled >= cap;
//   const fillPct = Math.min((enrolled / cap) * 100, 100);
//   const color = cancelled ? "#fca5a5" : enrolled >= cap ? "#f59e0b" : "#20BEF9";

//   return (
//     <div
//       className="bg-white rounded-2xl p-4 shadow-sm"
//       style={{ borderLeft: `4px solid ${color}` }}
//     >
//       <p className="text-xs font-bold mb-1" style={{ color: "#20BEF9" }}>
//         {formatTime(section.StartTime)} - {formatTime(section.endTime)}
//       </p>
//       <div className="flex items-start justify-between gap-2">
//         <h3
//           className={`font-extrabold text-[20px] leading-tight ${cancelled ? "text-gray-400" : "text-gray-800"}`}
//         >
//           {section.title}
//         </h3>
//         {!cancelled && (
//           <button
//             onClick={onEdit}
//             className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-xl transition flex-shrink-0"
//           >
//             <PencilIcon className="h-3.5 w-3.5 text-gray-500" />
//           </button>
//         )}
//         {cancelled && (
//           <Lock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
//         )}
//       </div>

//       <div className="flex items-center gap-4 mt-2">
//         <span className="flex items-center gap-1 text-sm text-gray-500">
//           <User className="h-3.5 w-3.5" />
//           {section.teacher?.fullName ?? "No Teacher"}
//         </span>
//         <span className="flex items-center gap-1 text-sm text-gray-500">
//           <Users className="h-3.5 w-3.5" />
//           {enrolled}/{cap} Seats
//         </span>
//       </div>

//       <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//         <div
//           className="h-full rounded-full transition-all duration-500"
//           style={{ width: `${fillPct}%`, backgroundColor: color }}
//         />
//       </div>

//       {fullyBooked && (
//         <div className="mt-2">
//           <span className="text-xs font-extrabold tracking-widest px-3 py-1 rounded-full border border-amber-300 text-amber-600 bg-amber-50">
//             FULLY BOOKED
//           </span>
//         </div>
//       )}

//       {cancelled && (
//         <div className="mt-2 flex items-center gap-1">
//           <span className="text-red-400 text-sm">⊗</span>
//           <span className="text-xs font-extrabold tracking-widest text-red-400">
//             CANCELLED
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Main ──────────────────────────────────────────────────────────
// export default function Session() {
//   const todayObj = new Date();
//   const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

//   const [sections, setSections] = useState<Section[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loadingSections, setLoadingSections] = useState(true);
//   const [loadingTeachers, setLoadingTeachers] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(todayStr);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [sheet, setSheet] = useState<null | "create" | Section>(null);
//   const [visible, setVisible] = useState(false);
//   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const openSheet = (s: "create" | Section) => {
//     if (timer.current) clearTimeout(timer.current);
//     setSheet(s);
//     requestAnimationFrame(() => setVisible(true));
//   };

//   const closeSheet = () => {
//     setVisible(false);
//     timer.current = setTimeout(() => setSheet(null), 350);
//   };

//   const fetchSections = async () => {
//     try {
//       setLoadingSections(true);
//       const res = await fetch(`${BACKEND_URL}/api/admin-section`);
//       if (!res.ok) throw new Error("failed");
//       const data = await res.json();
//       setSections(Array.isArray(data) ? data : []);
//     } catch {
//       setSections([]);
//     } finally {
//       setLoadingSections(false);
//     }
//   };

//   const fetchTeachers = async () => {
//     try {
//       setLoadingTeachers(true);
//       const res = await fetch(`${BACKEND_URL}/api/admin/teachers`);
//       if (!res.ok) throw new Error("failed");
//       const data = await res.json();
//       setTeachers(Array.isArray(data) ? data : []);
//     } catch {
//       setTeachers([]);
//     } finally {
//       setLoadingTeachers(false);
//     }
//   };

//   useEffect(() => {
//     fetchSections();
//     fetchTeachers();
//   }, []);

//   const handleSuccess = () => {
//     closeSheet();
//     setTimeout(fetchSections, 400);
//   };

//   const filteredSections = sections.filter(
//     (s) => isoToDateInput(s.StartTime) === selectedDate,
//   );
//   const activeDates = new Set(sections.map((s) => isoToDateInput(s.StartTime)));

//   const MONTHS = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const [selYear, selMonth] = selectedDate.split("-").map(Number);
//   const headerLabel = `${MONTHS[selMonth - 1]} ${selYear}`;

//   const selDateObj = new Date(`${selectedDate}T00:00:00`);
//   const dateLabel = selDateObj.toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "short",
//     day: "numeric",
//   });

//   return (
//     <div className="relative">
//       <div className="px-5 py-3">
//         <button
//           onClick={() => setShowCalendar(true)}
//           className="flex items-center gap-2 bg-[#E0F8FF] text-[#006688] font-bold text-sm px-4 py-2 rounded-full"
//         >
//           <CalendarIcon className="h-4 w-4" />
//           {headerLabel}
//           <span className="text-xs">▾</span>
//         </button>
//       </div>

//       {showCalendar && (
//         <CalendarPicker
//           selectedDate={selectedDate}
//           onSelect={setSelectedDate}
//           onClose={() => setShowCalendar(false)}
//           activeDates={activeDates}
//         />
//       )}

//       <div className="mx-5 mb-4 bg-[#E0F8FF] rounded-2xl px-4 py-3 flex items-start gap-2">
//         <Info className="h-4 w-4 text-[#006688] flex-shrink-0 mt-0.5" />
//         <p className="text-xs text-[#006688] leading-relaxed">
//           <span className="font-extrabold">Auto-Cancellation:</span> 48 цагийн
//           өмнө 3-аас бага хүнтэй бол цуцлагдана.
//         </p>
//       </div>

//       <div className="px-5 flex items-center justify-between mb-4">
//         <div>
//           <h2 className="font-extrabold text-2xl text-gray-900">
//             {selectedDate === todayStr ? "Today's Sessions" : "Sessions"}
//           </h2>
//           <p className="text-sm text-gray-500">{dateLabel}</p>
//         </div>
//         <button
//           onClick={() => openSheet("create")}
//           className="bg-[#20BEF9] text-white rounded-2xl p-3 shadow-lg active:scale-95 transition"
//         >
//           <Plus className="h-6 w-6" />
//         </button>
//       </div>

//       <div className="px-5 flex flex-col gap-3 pb-6">
//         {loadingSections ? (
//           <div className="flex justify-center py-16">
//             <Loader2 className="h-7 w-7 animate-spin text-[#20BEF9]" />
//           </div>
//         ) : filteredSections.length === 0 ? (
//           <div className="flex flex-col items-center py-16 gap-3">
//             <CalendarIcon className="h-10 w-10 text-gray-200" />
//             <p className="text-center text-gray-400 text-sm">
//               {dateLabel} дээр хичээл алга
//             </p>
//           </div>
//         ) : (
//           filteredSections.map((s) => (
//             <SessionCard key={s.id} section={s} onEdit={() => openSheet(s)} />
//           ))
//         )}
//       </div>

//       {sheet !== null && (
//         <>
//           <div
//             onClick={closeSheet}
//             className="fixed inset-0 z-20 bg-black/45 transition-opacity"
//             style={{ opacity: visible ? 1 : 0 }}
//           />
//           <div
//             className="fixed left-0 right-0 bottom-0 z-30 bg-[#E0F8FF] rounded-t-3xl px-5 pt-3 pb-16 shadow-2xl overflow-y-auto max-h-[92vh]"
//             style={{
//               transform: visible ? "translateY(0)" : "translateY(100%)",
//               transition: "transform 350ms cubic-bezier(0.32,0.72,0,1)",
//             }}
//           >
//             <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
//             {sheet === "create" ? (
//               <CreateSession
//                 onClose={closeSheet}
//                 onSuccess={handleSuccess}
//                 defaultDate={selectedDate}
//               />
//             ) : (
//               <EditForm
//                 section={sheet as Section}
//                 teachers={teachers}
//                 loadingTeachers={loadingTeachers}
//                 onClose={closeSheet}
//                 onSuccess={handleSuccess}
//               />
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  CalendarIcon,
  Loader2,
  ArrowLeft,
  Plus,
  Users,
  User,
  Lock,
  PencilIcon,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CreateSession from "./CreateSession";

interface Teacher {
  id: string;
  fullName: string;
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
  enrolledCount?: number;
}

const BACKEND_URL = "https://tokalot.vercel.app";

// ── Цаг форматлах (11:11 -> 11:11 AM) ──────────────────────────
function formatTime(iso: string) {
  if (!iso) return "";
  try {
    // ISO-гоос зөвхөн цагийн хэсгийг салгах (T-гээс хойшхи хэсэг)
    const timePart = iso.includes("T") ? iso.split("T")[1] : iso;
    const parts = timePart.split(":");
    const hourStr = parts[0];
    const minuteStr = parts[1];

    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 === 0 ? 12 : hour % 12;

    return `${String(h12).padStart(2, "0")}:${minuteStr} ${ampm}`;
  } catch {
    return iso;
  }
}

// ── ISO-гоос зөвхөн огноо салгах (2026-04-07) ──────────────────
function isoToDateInput(iso: string) {
  if (!iso) return "";
  try {
    return iso.split("T")[0];
  } catch {
    return "";
  }
}

// ── ISO-гоос зөвхөн цаг салгах (11:11) ──────────────────────────
function isoToTimeInput(iso: string) {
  if (!iso) return "";
  try {
    const timePart = iso.includes("T") ? iso.split("T")[1] : iso;
    const parts = timePart.split(":");
    return `${parts[0]}:${parts[1]}`;
  } catch {
    return "";
  }
}

// ── Calendar Picker ──────────────────────────────────────────────
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

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl p-5 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-extrabold text-gray-800">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-bold text-gray-400 py-1"
            >
              {d}
            </div>
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
                className={`relative flex flex-col items-center justify-center h-9 w-9 mx-auto rounded-xl text-sm font-bold transition
                  ${isSelected ? "bg-[#20BEF9] text-white" : "hover:bg-[#E0F8FF] text-gray-700"}`}
              >
                {day}
                {hasSession && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-[#20BEF9]"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => {
            const t = new Date();
            const todayStr = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
            onSelect(todayStr);
            onClose();
          }}
          className="mt-4 w-full py-2.5 rounded-xl bg-[#E0F8FF] text-[#006688] font-extrabold text-sm tracking-widest"
        >
          {" "}
          TODAY{" "}
        </button>
      </div>
    </div>
  );
}

// ── EditForm ─────────────────────────────────────────────────────
function EditForm({
  section,
  teachers,
  loadingTeachers,
  onClose,
  onSuccess,
}: {
  section: Section;
  teachers: Teacher[];
  loadingTeachers: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: section.title,
    sessionDate: isoToDateInput(section.StartTime),
    startTime: isoToTimeInput(section.StartTime),
    endTime: isoToTimeInput(section.endTime),
    capacity: String(section.capacity),
    teacherId: section.teacherId,
  });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (form.endTime <= form.startTime) {
    setError("End time нь start time-аас хожуу байх ёстой.");
    return;
  }
  setLoading(true);
  setError("");
  try {
    // Backend이 받는 field들만 전송
    const payload = {
      title: form.title,
      level: section.level || "Beginner",
      startTime: `${form.sessionDate}T${form.startTime}:00`,
      endTime: `${form.sessionDate}T${form.endTime}:00`,
      capacity: parseInt(form.capacity), // Number로 변환
      status: section.status,
    };
    const res = await fetch(
      `${BACKEND_URL}/api/admin/patch.session/${section.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.error || `Error: ${res.status}`);
    }
    onSuccess();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Алдаа гарлаа");
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async () => {
    if (!confirm("Энэ session-г устгах уу?")) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/delete.session/${section.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();
      onSuccess();
    } catch {
      setError("Устгахад алдаа гарлаа.");
    } finally {
      setDeleting(false);
    }
  };

  const inputCls = "bg-transparent outline-none text-sm w-full font-medium";

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      <div className="flex items-center gap-3 mb-1">
        <button type="button" onClick={onClose} className="text-[#20BEF9]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="bg-[#C2E8FF] p-2 rounded-xl">
          <CalendarIcon className="h-5 w-5 text-[#006688]" />
        </div>
        <h2 className="font-extrabold text-lg">Edit Session</h2>
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
          className={inputCls}
        >
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.fullName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "SAVING..." : "SAVE SESSION"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="border-2 border-red-400 text-red-500 font-extrabold tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 bg-white mt-1"
      >
        {deleting ? "DELETING..." : "DELETE SESSION"}
      </button>
    </form>
  );
}

// ── SessionCard ───────────────────────────────────────────────────
function SessionCard({
  section,
  onEdit,
}: {
  section: Section;
  onEdit: () => void;
}) {
  const enrolled = section.enrolledCount ?? 0;
  const cap = section.capacity;
  const cancelled = !section.status;
  const color = cancelled ? "#fca5a5" : enrolled >= cap ? "#f59e0b" : "#20BEF9";

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm border-l-4"
      style={{ borderColor: color }}
    >
      <p className="text-xs font-bold mb-1" style={{ color: "#20BEF9" }}>
        {formatTime(section.StartTime)} - {formatTime(section.endTime)}
      </p>
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-extrabold text-[20px] leading-tight ${cancelled ? "text-gray-400" : "text-gray-800"}`}
        >
          {section.title}
        </h3>
        {!cancelled && (
          <button
            onClick={onEdit}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition"
          >
            <PencilIcon className="h-4 w-4 text-gray-500" />
          </button>
        )}
        {cancelled && <Lock className="h-4 w-4 text-gray-400 mt-1" />}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <User className="h-3.5 w-3.5" />
          {section.teacher?.fullName ?? "No Teacher"}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Users className="h-3.5 w-3.5" />
          {enrolled}/{cap} Seats
        </span>
      </div>

      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${Math.min((enrolled / cap) * 100, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {cancelled && (
        <p className="mt-2 text-xs font-extrabold text-red-400 tracking-widest uppercase">
          Cancelled
        </p>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function Session() {
  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, "0")}-${String(todayObj.getDate()).padStart(2, "0")}`;

  const [sections, setSections] = useState<Section[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sheet, setSheet] = useState<null | "create" | Section>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<any>(null);

  const openSheet = (s: "create" | Section) => {
    setSheet(s);
    setTimeout(() => setVisible(true), 10);
  };

  const closeSheet = () => {
    setVisible(false);
    timer.current = setTimeout(() => setSheet(null), 350);
  };

  const fetchSections = async () => {
    setLoadingSections(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin-section`);
      const data = await res.json();
      setSections(Array.isArray(data) ? data : []);
    } catch {
      setSections([]);
    } finally {
      setLoadingSections(false);
    }
  };

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/teachers`);
      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch {
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  };

  useEffect(() => {
    fetchSections();
    fetchTeachers();
  }, []);

  const handleSuccess = () => {
    closeSheet();
    setTimeout(fetchSections, 400);
  };

  const filteredSections = sections.filter(
    (s) => isoToDateInput(s.StartTime) === selectedDate,
  );
  const activeDates = new Set(sections.map((s) => isoToDateInput(s.StartTime)));

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
  const [selYear, selMonth] = selectedDate.split("-").map(Number);
  const dateLabel = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "short", day: "numeric" },
  );

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      <div className="px-5 py-4">
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 bg-[#E0F8FF] text-[#006688] font-bold text-sm px-4 py-2.5 rounded-full shadow-sm"
        >
          <CalendarIcon className="h-4 w-4" /> {MONTHS[selMonth - 1]} {selYear}{" "}
          <span className="text-xs ml-1">▼</span>
        </button>
      </div>

      {showCalendar && (
        <CalendarPicker
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          onClose={() => setShowCalendar(false)}
          activeDates={activeDates}
        />
      )}

      <div className="mx-5 mb-5 bg-[#E0F8FF] rounded-2xl px-4 py-3 flex items-start gap-2 border border-[#C2E8FF]">
        <Info className="h-4 w-4 text-[#006688] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#006688] leading-relaxed font-medium">
          <span className="font-extrabold uppercase">Auto-Cancellation:</span>{" "}
          48 цагийн өмнө 3-аас бага хүнтэй бол цуцлагдана.
        </p>
      </div>

      <div className="px-5 flex items-center justify-between mb-5">
        <div>
          <h2 className="font-extrabold text-2xl text-gray-900">
            {selectedDate === todayStr ? "Today's Sessions" : "Sessions"}
          </h2>
          <p className="text-sm font-medium text-gray-500">{dateLabel}</p>
        </div>
        <button
          onClick={() => openSheet("create")}
          className="bg-[#20BEF9] text-white rounded-2xl p-3.5 shadow-lg active:scale-90 transition transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {loadingSections ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#20BEF9]" />
          </div>
        ) : filteredSections.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-400 gap-3">
            <CalendarIcon className="h-12 w-12 opacity-20" />
            <p className="font-bold">{dateLabel} дээр хичээл алга</p>
          </div>
        ) : (
          filteredSections.map((s) => (
            <SessionCard key={s.id} section={s} onEdit={() => openSheet(s)} />
          ))
        )}
      </div>

      {sheet !== null && (
        <>
          <div
            onClick={closeSheet}
            className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
          />
          <div
            className={`fixed inset-x-0 bottom-0 z-50 bg-[#E0F8FF] rounded-t-[40px] px-6 pt-2 pb-10 shadow-2xl transition-transform duration-500 ease-out max-h-[94vh] overflow-y-auto ${visible ? "translate-y-0" : "translate-y-full"}`}
          >
            <div className="w-12 h-1.5 bg-gray-300/60 rounded-full mx-auto my-4" />
            {sheet === "create" ? (
              <CreateSession
                onClose={closeSheet}
                onSuccess={handleSuccess}
                defaultDate={selectedDate}
              />
            ) : (
              <EditForm
                section={sheet as Section}
                teachers={teachers}
                loadingTeachers={loadingTeachers}
                onClose={closeSheet}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
