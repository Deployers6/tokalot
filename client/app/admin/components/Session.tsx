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
//   Trash2,
//   X,
// } from "lucide-react";
// import { useAuth } from "@clerk/nextjs";
// import CreateSession from "./CreateSession";

// interface Teacher {
//   id: string;
//   fullName: string;
// }

// interface Booking {
//   id: string;
//   clerkId: string;
//   sectionId: string;
//   status: boolean;
//   isTrial: boolean;
//   createdAt: string;
//   updatedAt: string;
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
//   bookings?: Booking[];
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

// // ── BookingsModal ───────────────────────────────────────────────
// interface ClerkUser {
//   clerkId: string;
//   fullName: string;
//   email: string;
//   membershipStatus: string;
//   isMember: boolean;
// }

// function BookingsModal({
//   section,
//   onClose,
//   adminId,
// }: {
//   section: Section;
//   onClose: () => void;
//   adminId: string | null | undefined;
// }) {
//   const [users, setUsers] = useState<ClerkUser[]>([]);
//   const [loadingUsers, setLoadingUsers] = useState(true);

//   useEffect(() => {
//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//     };
//     if (adminId) headers["x-admin-id"] = adminId;

//     fetch(`${BACKEND_URL}/api/admin/get-user`, { headers })
//       .then((r) => r.json())
//       .then((data) => setUsers(Array.isArray(data) ? data : []))
//       .catch(() => setUsers([]))
//       .finally(() => setLoadingUsers(false));
//   }, [adminId]);

//   const getUserName = (clerkId: string) => {
//     const user = users.find((u) => u.clerkId === clerkId);
//     return user ? user.fullName : clerkId;
//   };

//   const getUserEmail = (clerkId: string) => {
//     const user = users.find((u) => u.clerkId === clerkId);
//     return user ? user.email : "";
//   };

//   const getUserMembership = (clerkId: string) => {
//     const user = users.find((u) => u.clerkId === clerkId);
//     return user ? user.membershipStatus : null;
//   };

//   const activeBookings = (section.bookings || []).filter((b) => b.status);
//   const allBookings = section.bookings || [];

//   return (
//     <div
//       className="absolute inset-0 z-[70] flex items-end justify-center"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
//       <div
//         className="relative bg-white rounded-t-[32px] w-full px-6 pt-4 pb-10 shadow-2xl max-h-[70%] flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Handle */}
//         <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h2 className="font-extrabold text-lg text-gray-900">Bookings</h2>
//             <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
//               {section.title}
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="bg-gray-100 p-2 rounded-xl text-gray-500"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="flex gap-3 mb-4">
//           <div className="flex-1 bg-[#E0F8FF] rounded-2xl px-4 py-3 text-center">
//             <p className="text-xl font-extrabold text-[#20BEF9]">
//               {activeBookings.length}
//             </p>
//             <p className="text-[10px] font-bold text-[#006688] uppercase">
//               Active
//             </p>
//           </div>
//           <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-center">
//             <p className="text-xl font-extrabold text-gray-400">
//               {allBookings.length - activeBookings.length}
//             </p>
//             <p className="text-[10px] font-bold text-gray-400 uppercase">
//               Cancelled
//             </p>
//           </div>
//           <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-center">
//             <p className="text-xl font-extrabold text-gray-600">
//               {section.capacity}
//             </p>
//             <p className="text-[10px] font-bold text-gray-400 uppercase">
//               Capacity
//             </p>
//           </div>
//         </div>

//         {/* Bookings List */}
//         <div className="overflow-y-auto flex-1 flex flex-col gap-2">
//           {loadingUsers ? (
//             <div className="py-10 flex justify-center">
//               <Loader2 className="animate-spin text-[#20BEF9]" size={24} />
//             </div>
//           ) : allBookings.length === 0 ? (
//             <div className="py-10 text-center text-gray-300 font-bold text-sm uppercase tracking-widest">
//               No Bookings Yet
//             </div>
//           ) : (
//             allBookings.map((booking, index) => {
//               const name = getUserName(booking.clerkId);
//               const email = getUserEmail(booking.clerkId);
//               const membership = getUserMembership(booking.clerkId);
//               const initials = name
//                 .split(" ")
//                 .map((w) => w[0])
//                 .join("")
//                 .slice(0, 2)
//                 .toUpperCase();

//               return (
//                 <div
//                   key={booking.id}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
//                     booking.status
//                       ? "bg-[#E0F8FF] border-[#A8E6FA]"
//                       : "bg-gray-50 border-gray-100"
//                   }`}
//                 >
//                   <div
//                     className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
//                       booking.status
//                         ? "bg-[#20BEF9] text-white"
//                         : "bg-gray-200 text-gray-400"
//                     }`}
//                   >
//                     {initials || index + 1}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-extrabold text-sm text-gray-800 truncate leading-tight">
//                       {name}
//                     </p>
//                     {email ? (
//                       <p className="text-[10px] text-gray-400 font-medium truncate">
//                         {email}
//                       </p>
//                     ) : null}
//                     <p className="text-[10px] text-gray-400 font-medium">
//                       {booking.isTrial ? "Trial" : "Regular"} ·{" "}
//                       {new Date(booking.createdAt).toLocaleDateString()}
//                       {membership ? ` · ${membership}` : ""}
//                     </p>
//                   </div>
//                   <span
//                     className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg shrink-0 ${
//                       booking.status
//                         ? "bg-[#20BEF9]/20 text-[#006688]"
//                         : "bg-gray-200 text-gray-400"
//                     }`}
//                   >
//                     {booking.status ? "Active" : "Cancelled"}
//                   </span>
//                 </div>
//               );
//             })
//           )}
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
//   const [deleting, setDeleting] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);
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

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       const res = await fetch(
//         `${BACKEND_URL}/api/admin/delete.session/${section.id}`,
//         { method: "DELETE" },
//       );
//       if (!res.ok) throw new Error("Delete failed");
//       onSuccess();
//     } catch (err: any) {
//       setError(err.message);
//       setDeleting(false);
//       setConfirmDelete(false);
//     }
//   };

//   const inputCls = "bg-transparent outline-none text-sm w-full font-bold";

//   // Confirm delete overlay
//   if (confirmDelete) {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center gap-3 mb-1">
//           <button
//             type="button"
//             onClick={() => setConfirmDelete(false)}
//             className="text-[#20BEF9]"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <h2 className="font-extrabold text-lg">Delete Session</h2>
//         </div>
//         <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4 text-center">
//           <Trash2 size={32} className="mx-auto mb-2 text-red-400" />
//           <p className="font-extrabold text-gray-800 mb-1">
//             Delete this session?
//           </p>
//           <p className="text-xs text-gray-500 font-medium">
//             "{section.title}" will be permanently removed. This action cannot be
//             undone.
//           </p>
//         </div>
//         {error && (
//           <p className="text-red-500 text-xs text-center font-bold">{error}</p>
//         )}
//         <button
//           onClick={handleDelete}
//           disabled={deleting}
//           className="bg-red-500 text-white font-extrabold py-4 rounded-xl flex justify-center"
//         >
//           {deleting ? (
//             <Loader2 className="animate-spin" size={20} />
//           ) : (
//             "YES, DELETE"
//           )}
//         </button>
//         <button
//           onClick={() => setConfirmDelete(false)}
//           className="bg-gray-100 text-gray-600 font-extrabold py-4 rounded-xl"
//         >
//           CANCEL
//         </button>
//       </div>
//     );
//   }

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
//       {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-[#20BEF9] text-white font-extrabold py-4 rounded-xl mt-1 flex justify-center"
//       >
//         {loading ? (
//           <Loader2 className="animate-spin" size={20} />
//         ) : (
//           "SAVE CHANGES"
//         )}
//       </button>
//       {/* Delete button for all sessions (active or cancelled) */}
//       <button
//         type="button"
//         onClick={() => setConfirmDelete(true)}
//         className="bg-red-50 text-red-500 border border-red-200 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2"
//       >
//         <Trash2 size={16} />
//         DELETE SESSION
//       </button>
//     </form>
//   );
// }

// // ── CancelledEditForm ───────────────────────────────────────────
// function CancelledEditForm({
//   section,
//   onClose,
//   onSuccess,
// }: {
//   section: Section;
//   onClose: () => void;
//   onSuccess: () => void;
// }) {
//   const [deleting, setDeleting] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);
//   const [error, setError] = useState("");

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       const res = await fetch(
//         `${BACKEND_URL}/api/admin/delete.session/${section.id}`,
//         { method: "DELETE" },
//       );
//       if (!res.ok) throw new Error("Delete failed");
//       onSuccess();
//     } catch (err: any) {
//       setError(err.message);
//       setDeleting(false);
//       setConfirmDelete(false);
//     }
//   };

//   if (confirmDelete) {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex items-center gap-3 mb-1">
//           <button
//             type="button"
//             onClick={() => setConfirmDelete(false)}
//             className="text-[#20BEF9]"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <h2 className="font-extrabold text-lg">Delete Session</h2>
//         </div>
//         <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4 text-center">
//           <Trash2 size={32} className="mx-auto mb-2 text-red-400" />
//           <p className="font-extrabold text-gray-800 mb-1">
//             Delete this session?
//           </p>
//           <p className="text-xs text-gray-500 font-medium">
//             "{section.title}" will be permanently removed. This action cannot be
//             undone.
//           </p>
//         </div>
//         {error && (
//           <p className="text-red-500 text-xs text-center font-bold">{error}</p>
//         )}
//         <button
//           onClick={handleDelete}
//           disabled={deleting}
//           className="bg-red-500 text-white font-extrabold py-4 rounded-xl flex justify-center"
//         >
//           {deleting ? (
//             <Loader2 className="animate-spin" size={20} />
//           ) : (
//             "YES, DELETE"
//           )}
//         </button>
//         <button
//           onClick={() => setConfirmDelete(false)}
//           className="bg-gray-100 text-gray-600 font-extrabold py-4 rounded-xl"
//         >
//           CANCEL
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex items-center gap-3 mb-1">
//         <button type="button" onClick={onClose} className="text-[#20BEF9]">
//           <ArrowLeft size={20} />
//         </button>
//         <h2 className="font-extrabold text-lg">Cancelled Session</h2>
//       </div>
//       <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
//         <p className="font-extrabold text-gray-700 text-sm">{section.title}</p>
//         <p className="text-[11px] text-gray-400 font-medium mt-0.5">
//           {formatTime(section.StartTime)} — {formatTime(section.endTime)}
//         </p>
//         <p className="text-[11px] text-red-400 font-bold mt-1 uppercase tracking-wide">
//           This session has been cancelled
//         </p>
//       </div>
//       <button
//         type="button"
//         onClick={() => setConfirmDelete(true)}
//         className="bg-red-500 text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-2"
//       >
//         <Trash2 size={16} />
//         DELETE SESSION
//       </button>
//     </div>
//   );
// }

// // ── SessionCard ────────────────────────────────────────────────
// function SessionCard({
//   section,
//   onEdit,
//   onViewBookings,
// }: {
//   section: Section;
//   onEdit: () => void;
//   onViewBookings: () => void;
// }) {
//   // FIX #3: Only count active bookings (status: true)
//   const activeBookings = (section.bookings || []).filter(
//     (b) => b.status,
//   ).length;
//   const totalBookings = (section.bookings || []).length;
//   const cap = section.capacity;
//   const cancelled = !section.status;
//   const color = cancelled
//     ? "#fca5a5"
//     : activeBookings >= cap
//       ? "#f59e0b"
//       : "#20BEF9";
//   const fillPct = Math.min((activeBookings / cap) * 100, 100);

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
//         {/* FIX #1 & #2: Show edit button for ALL sessions including cancelled */}
//         <button
//           onClick={onEdit}
//           className="bg-gray-50 p-2 rounded-xl text-gray-400"
//         >
//           <PencilIcon size={14} />
//         </button>
//       </div>
//       <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
//         <span className="flex items-center gap-1">
//           <User size={12} />
//           {section.teacher?.fullName || "—"}
//         </span>
//         {/* FIX #3 & #4: Show active/total, tap to view bookings */}
//         <button
//           onClick={onViewBookings}
//           className="flex items-center gap-1 hover:text-[#20BEF9] transition-colors"
//         >
//           <Users size={12} />
//           {activeBookings}/{cap} Bookings
//           {totalBookings > activeBookings && (
//             <span className="text-[10px] text-gray-400">
//               ({totalBookings - activeBookings} cancelled)
//             </span>
//           )}
//         </button>
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
//   const { userId } = useAuth();
//   const [sections, setSections] = useState<Section[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(
//     () => new Date().toISOString().split("T")[0],
//   );
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [sheet, setSheet] = useState<null | "create" | Section>(null);
//   const [visible, setVisible] = useState(false);
//   // FIX #4: Bookings modal state
//   const [bookingsSection, setBookingsSection] = useState<Section | null>(null);

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
//             <SessionCard
//               key={s.id}
//               section={s}
//               onEdit={() => openSheet(s)}
//               onViewBookings={() => setBookingsSection(s)}
//             />
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

//       {/* FIX #4: Bookings Modal */}
//       {bookingsSection && (
//         <BookingsModal
//           section={bookingsSection}
//           onClose={() => setBookingsSection(null)}
//           adminId={userId}
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
//             ) : sheet.status ? (
//               // Active session → full edit + delete
//               <EditForm
//                 section={sheet}
//                 teachers={teachers}
//                 onClose={closeSheet}
//                 onSuccess={() => {
//                   fetchSections();
//                   closeSheet();
//                 }}
//               />
//             ) : (
//               // Cancelled session → delete only
//               <CancelledEditForm
//                 section={sheet}
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
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import CreateSession from "./CreateSession";

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
  try {
    const timePart = iso.includes("T") ? iso.split("T")[1] : iso;
    const [hour, minute] = timePart.split(":");
    const h = parseInt(hour, 10);
    const period = h >= 12 ? "PM" : "AM";
    const display = h % 12 || 12;
    return `${String(display).padStart(2, "0")}:${minute} ${period}`;
  } catch {
    return iso;
  }
}

function isoToDateInput(iso: string) {
  try {
    return iso.split("T")[0];
  } catch {
    return "";
  }
}

function isoToTimeInput(iso: string) {
  try {
    const timePart = iso.includes("T") ? iso.split("T")[1] : iso;
    const [hour, minute] = timePart.split(":");
    return `${hour.padStart(2, "0")}:${minute}`;
  } catch {
    return "";
  }
}

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

interface ClerkUser {
  clerkId: string;
  fullName: string;
  email: string;
  membershipStatus: string;
  isMember: boolean;
}

function BookingsModal({
  section,
  onClose,
  adminId,
}: {
  section: Section;
  onClose: () => void;
  adminId: string | null | undefined;
}) {
  const [users, setUsers] = useState<ClerkUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (adminId) headers["x-admin-id"] = adminId;

    fetch(`${BACKEND_URL}/api/admin/get-user`, { headers })
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, [adminId]);

  const getUserName = (clerkId: string) => {
    const user = users.find((u) => u.clerkId === clerkId);
    return user ? user.fullName : clerkId;
  };

  const getUserEmail = (clerkId: string) => {
    const user = users.find((u) => u.clerkId === clerkId);
    return user ? user.email : "";
  };

  const getUserMembership = (clerkId: string) => {
    const user = users.find((u) => u.clerkId === clerkId);
    return user ? user.membershipStatus : null;
  };

  const activeBookings = (section.bookings || []).filter((b) => b.status);
  const allBookings = section.bookings || [];

  return (
    <div
      className="absolute inset-0 z-[70] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-t-[32px] w-full px-6 pt-4 pb-10 shadow-2xl max-h-[70%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-lg text-gray-900">Bookings</h2>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              {section.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 p-2 rounded-xl text-gray-500"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-[#E0F8FF] rounded-2xl px-4 py-3 text-center">
            <p className="text-xl font-extrabold text-[#20BEF9]">
              {activeBookings.length}
            </p>
            <p className="text-[10px] font-bold text-[#006688] uppercase">
              Active
            </p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-xl font-extrabold text-gray-400">
              {allBookings.length - activeBookings.length}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Cancelled
            </p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-center">
            <p className="text-xl font-extrabold text-gray-600">
              {section.capacity}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Capacity
            </p>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 flex flex-col gap-2">
          {loadingUsers ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="animate-spin text-[#20BEF9]" size={24} />
            </div>
          ) : allBookings.length === 0 ? (
            <div className="py-10 text-center text-gray-300 font-bold text-sm uppercase tracking-widest">
              No Bookings Yet
            </div>
          ) : (
            allBookings.map((booking, index) => {
              const name = getUserName(booking.clerkId);
              const email = getUserEmail(booking.clerkId);
              const membership = getUserMembership(booking.clerkId);
              const initials = name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={booking.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
                    booking.status
                      ? "bg-[#E0F8FF] border-[#A8E6FA]"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      booking.status
                        ? "bg-[#20BEF9] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {initials || index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-sm text-gray-800 truncate leading-tight">
                      {name}
                    </p>
                    {email ? (
                      <p className="text-[10px] text-gray-400 font-medium truncate">
                        {email}
                      </p>
                    ) : null}
                    <p className="text-[10px] text-gray-400 font-medium">
                      {booking.isTrial ? "Trial" : "Regular"} ·{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                      {membership ? ` · ${membership}` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg shrink-0 ${
                      booking.status
                        ? "bg-[#20BEF9]/20 text-[#006688]"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {booking.status ? "Active" : "Cancelled"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function EditForm({
  section,
  teachers,
  loadingTeachers,
  onClose,
  onSuccess,
}: any) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
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
        StartTime: `${form.sessionDate}T${form.startTime}:00`,
        endTime: `${form.sessionDate}T${form.endTime}:00`,
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
    setDeleting(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/delete.session/${section.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Delete failed");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const inputCls = "bg-transparent outline-none text-sm w-full font-bold";

  if (confirmDelete) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="text-[#20BEF9]"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-extrabold text-lg">Delete Session</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4 text-center">
          <Trash2 size={32} className="mx-auto mb-2 text-red-400" />
          <p className="font-extrabold text-gray-800 mb-1">
            Delete this session?
          </p>
          <p className="text-xs text-gray-500 font-medium">
            "{section.title}" will be permanently removed. This action cannot be
            undone.
          </p>
        </div>
        {error && (
          <p className="text-red-500 text-xs text-center font-bold">{error}</p>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-500 text-white font-extrabold py-4 rounded-xl flex justify-center"
        >
          {deleting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "YES, DELETE"
          )}
        </button>
        <button
          onClick={() => setConfirmDelete(false)}
          className="bg-gray-100 text-gray-600 font-extrabold py-4 rounded-xl"
        >
          CANCEL
        </button>
      </div>
    );
  }

  return (
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
      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
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
        onClick={() => setConfirmDelete(true)}
        className="bg-red-50 text-red-500 border border-red-200 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2"
      >
        <Trash2 size={16} />
        DELETE SESSION
      </button>
    </form>
  );
}

function CancelledEditForm({
  section,
  onClose,
  onSuccess,
}: {
  section: Section;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/delete.session/${section.id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Delete failed");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (confirmDelete) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-1">
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="text-[#20BEF9]"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-extrabold text-lg">Delete Session</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-4 text-center">
          <Trash2 size={32} className="mx-auto mb-2 text-red-400" />
          <p className="font-extrabold text-gray-800 mb-1">
            Delete this session?
          </p>
          <p className="text-xs text-gray-500 font-medium">
            "{section.title}" will be permanently removed. This action cannot be
            undone.
          </p>
        </div>
        {error && (
          <p className="text-red-500 text-xs text-center font-bold">{error}</p>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-500 text-white font-extrabold py-4 rounded-xl flex justify-center"
        >
          {deleting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "YES, DELETE"
          )}
        </button>
        <button
          onClick={() => setConfirmDelete(false)}
          className="bg-gray-100 text-gray-600 font-extrabold py-4 rounded-xl"
        >
          CANCEL
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-1">
        <button type="button" onClick={onClose} className="text-[#20BEF9]">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-extrabold text-lg">Cancelled Session</h2>
      </div>
      <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
        <p className="font-extrabold text-gray-700 text-sm">{section.title}</p>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
          {formatTime(section.StartTime)} — {formatTime(section.endTime)}
        </p>
        <p className="text-[11px] text-red-400 font-bold mt-1 uppercase tracking-wide">
          This session has been cancelled
        </p>
      </div>
      <button
        type="button"
        onClick={() => setConfirmDelete(true)}
        className="bg-red-500 text-white font-extrabold py-4 rounded-xl flex items-center justify-center gap-2"
      >
        <Trash2 size={16} />
        DELETE SESSION
      </button>
    </div>
  );
}

function SessionCard({
  section,
  onEdit,
  onViewBookings,
}: {
  section: Section;
  onEdit: () => void;
  onViewBookings: () => void;
}) {
  const activeBookings = (section.bookings || []).filter(
    (b) => b.status,
  ).length;
  const totalBookings = (section.bookings || []).length;
  const cap = section.capacity;
  const cancelled = !section.status;
  const color = cancelled
    ? "#fca5a5"
    : activeBookings >= cap
      ? "#f59e0b"
      : "#20BEF9";
  const fillPct = Math.min((activeBookings / cap) * 100, 100);

  return (
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
        <button
          onClick={onEdit}
          className="bg-gray-50 p-2 rounded-xl text-gray-400"
        >
          <PencilIcon size={14} />
        </button>
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
        <span className="flex items-center gap-1">
          <User size={12} />
          {section.teacher?.fullName || "—"}
        </span>
        <button
          onClick={onViewBookings}
          className="flex items-center gap-1 hover:text-[#20BEF9] transition-colors"
        >
          <Users size={12} />
          {activeBookings}/{cap} Bookings
          {totalBookings > activeBookings && (
            <span className="text-[10px] text-gray-400">
              ({totalBookings - activeBookings} cancelled)
            </span>
          )}
        </button>
      </div>
      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${fillPct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function Session() {
  const { userId } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [sheet, setSheet] = useState<null | "create" | Section>(null);
  const [visible, setVisible] = useState(false);
  const [bookingsSection, setBookingsSection] = useState<Section | null>(null);

  const fetchSections = async (adminId: string) => {
    setLoading(true);
    try {
      const headers = { "x-admin-id": adminId };
      const res = await fetch(`${BACKEND_URL}/api/admin-section`, { headers });
      const data = await res.json();
      const list = data.sections || data.data || data || [];
      const full = await Promise.all(
        list.map(async (s: Section) => {
          try {
            const r = await fetch(`${BACKEND_URL}/api/admin-section/${s.id}`, {
              headers,
            });
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
    if (userId) {
      fetchSections(userId);
      fetchTeachers();
    }
  }, [userId]);

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
      <div className="px-5 py-4">
        <button
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-2 bg-[#E0F8FF] text-[#006688] font-bold text-xs px-4 py-2 rounded-full"
        >
          <CalendarIcon size={14} />
          {selectedDate} <span className="text-[10px]">▾</span>
        </button>
      </div>

      <div className="mx-5 mb-5 bg-[#E0F8FF] rounded-2xl px-4 py-3 flex items-start gap-2 border border-[#A8E6FA]">
        <Info className="h-4 w-4 text-[#006688] shrink-0 mt-0.5" />
        <p className="text-[10px] text-[#006688] font-medium leading-relaxed">
          <span className="font-extrabold uppercase">Auto-Cancel:</span>{" "}
          Sessions with under 3 participants 48h before start will be closed.
        </p>
      </div>

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
            <SessionCard
              key={s.id}
              section={s}
              onEdit={() => openSheet(s)}
              onViewBookings={() => setBookingsSection(s)}
            />
          ))
        )}
      </div>

      {showCalendar && (
        <CalendarPicker
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          onClose={() => setShowCalendar(false)}
          activeDates={activeDates}
        />
      )}

      {bookingsSection && (
        <BookingsModal
          section={bookingsSection}
          onClose={() => setBookingsSection(null)}
          adminId={userId}
        />
      )}

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
                  if (userId) fetchSections(userId);
                  closeSheet();
                }}
                defaultDate={selectedDate}
              />
            ) : sheet.status ? (
              <EditForm
                section={sheet}
                teachers={teachers}
                onClose={closeSheet}
                onSuccess={() => {
                  if (userId) fetchSections(userId);
                  closeSheet();
                }}
              />
            ) : (
              <CancelledEditForm
                section={sheet}
                onClose={closeSheet}
                onSuccess={() => {
                  if (userId) fetchSections(userId);
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
