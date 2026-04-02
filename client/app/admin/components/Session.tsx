// import React from "react";
// import Header from "./Header";
// import Footer from "./Footer";
// import DatePicker from "./Calendar";
// import { CircleAlert } from "lucide-react";

// const Sessions = () => {
//   return (
//     <div className="h-screen w-screen flex flex-col justify-between">
//       <div>
//         <Header />
//         <div className="w-screen mt-5 pl-5 border-b pb-5 border-[#BCC8D1]">
//           <DatePicker />
//         </div>

//         <div className="w-[358px] h-[61px] bg-[#C2E8FF] border-1 border-[#20BEF9] rounded-[8px] mt-5 flex ml-4 gap-2 px-2 ">
//           <CircleAlert className="h-[20px] w-[20px] mt-0.5" />
//           <div className="mt-1">
//             <p className="text-[11px] font-extrabold">Auto-Cancellation:</p>
//             <p className="text-[11px] ">
//               Sessions with under 3 participants 48h before start are
//               automatically cancelled and closed.
//             </p>
//           </div>
//         </div>
//         <div className="flex w-screen justify-between px-5 mt-5">
//           <div>
//             <div className="font-extrabold">Today's Sessions</div>
//             <div>Wednesday</div>
//           </div>
//           <div className="h-[52px] w-[52px] rounded-2xl bg-[#20BEF9] flex items-center justify-center text-[30px] text-[#004963] shadow-md shadow-[#20BEF9]">
//             +
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Sessions;

// "use client";
// import React from "react";
// import { useState } from "react";
// import Header from "./Header";
// import Footer from "./Footer";
// import DatePicker from "./Calendar";
// import { CircleAlert, Pencil, CircleUser, UsersRound } from "lucide-react";
// import { mockSessions } from "../lib/mockSessions";

// const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
// const DAYS = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// const Session = () => {
//   const today = new Date();
//   const [selected, setSelected] = useState<{
//     day: number;
//     month: number;
//     year: number;
//   } | null>(null);

//   const displayDate = selected
//     ? new Date(selected.year, selected.month, selected.day)
//     : today;

//   const dayName = DAYS[displayDate.getDay()];
//   const monthName = MONTHS[displayDate.getMonth()];
//   const dayNum = displayDate.getDate();

//   return (
//     <div className="h-screen w-screen flex flex-col justify-between bg-white">
//       <div>
//         <div className="w-screen mt-5 pl-5 border-b pb-5 border-[#BCC8D1]">
//           {/* selected болон setSelected-ийг Calendar руу дамжуулна */}
//           <DatePicker selected={selected} setSelected={setSelected} />
//         </div>

//         <div className="w-[358px] h-[61px] bg-[#C2E8FF] border-1 border-[#20BEF9] rounded-[8px] mt-5 flex ml-4 gap-2 px-2">
//           <CircleAlert className="h-[20px] w-[20px] mt-0.5" />
//           <div className="mt-1">
//             <p className="text-[11px] font-extrabold">Auto-Cancellation:</p>
//             <p className="text-[11px]">
//               Sessions with under 3 participants 48h before start are
//               automatically cancelled and closed.
//             </p>
//           </div>
//         </div>

//         <div className="flex w-screen justify-between px-5 mt-5">
//           <div>
//             <div className="font-extrabold">Sessions</div>
//             {/* Сонгосон огноог харуулна */}
//             <div className="text-gray-500 text-sm">
//               {dayName}, {monthName} {dayNum}
//             </div>
//           </div>
//           <div className="h-[52px] w-[52px] rounded-2xl bg-[#20BEF9] flex items-center justify-center text-[30px] text-[#004963] shadow-md shadow-[#20BEF9]">
//             +
//           </div>
//         </div>
//         <div>
//           <div className="flex flex-col gap-5 mt-5 mx-5">
//             {mockSessions.map((session) => (
//               <div
//                 key={session.id}
//                 className="bg-white shadow-md border-l-8 border-gray-500 rounded-[15px] flex flex-col gap-3 p-5"
//               >
//                 <div className="text-[#20BEF9] font-bold text-[13px]">
//                   {session.startTime} - {session.endTime}
//                 </div>
//                 <div className="flex justify-between">
//                   <h2 className="font-extrabold">{session.title}</h2>
//                   <div className="bg-[#DAF2F9] h-[30px] w-[30px] flex items-center justify-center rounded-[10px]">
//                     <Pencil className="h-[15px] w-[15px]  " />
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <div className="flex items-center justify-center gap-1">
//                     <CircleUser className="h-[15px] w-[15px] text-[#3D484F] " />
//                     <div className="text-[#3D484F]">{session.teacherName}</div>
//                   </div>
//                   <div className="flex items-center justify-center gap-1">
//                     <UsersRound className="h-[15px] w-[15px]" />
//                     <div className="flex">
//                       <div className="text-[#3D484F]">
//                         {session.availableSeats} /
//                       </div>
//                       <div className="text-[#3D484F]"> {session.capacity}</div>
//                     </div>
//                     <p className="text-[#3D484F]">Seats</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Session;

//SECOND VERSION WITH FEATURES

// "use client";
// import React from "react";
// import { useState } from "react";
// import Header from "./Header";
// import Footer from "./Footer";
// import DatePicker from "./Calendar";
// import {
//   CircleAlert,
//   Pencil,
//   CircleUser,
//   UsersRound,
//   XCircle,
// } from "lucide-react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogTrigger,
// // } from "@/app/admin/components/ui";

// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogTitle,
// } from "../components/ui/dialog";

// import CreateSession from "./CreateSession";
// import { mockSessions } from "../lib/mockSessions";
// import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

// const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
// const DAYS = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// const Session = () => {
//   const today = new Date();
//   const [selected, setSelected] = useState<{
//     day: number;
//     month: number;
//     year: number;
//   } | null>(null);

//   const displayDate = selected
//     ? new Date(selected.year, selected.month, selected.day)
//     : today;

//   const dayName = DAYS[displayDate.getDay()];
//   const monthName = MONTHS[displayDate.getMonth()];
//   const dayNum = displayDate.getDate();

//   return (
//     <div className="h-screen w-screen flex flex-col justify-between bg-white">
//       <div className="overflow-y-auto">
//         <div className="w-screen mt-5 pl-5 border-b pb-5 border-[#BCC8D1]">
//           <DatePicker selected={selected} setSelected={setSelected} />
//         </div>

//         <div className="w-[358px] h-[61px] bg-[#C2E8FF] border border-[#20BEF9] rounded-[8px] mt-5 flex ml-4 gap-2 px-2">
//           <CircleAlert className="h-[20px] w-[20px] mt-0.5 shrink-0" />
//           <div className="mt-1">
//             <p className="text-[11px] font-extrabold">Auto-Cancellation:</p>
//             <p className="text-[11px]">
//               Sessions with under 3 participants 48h before start are
//               automatically cancelled and closed.
//             </p>
//           </div>
//         </div>

//         <div className="flex w-screen justify-between px-5 mt-5">
//           <div>
//             <div className="font-extrabold text-lg">Sessions</div>
//             <div className="text-gray-500 text-sm">
//               {dayName}, {monthName} {dayNum}
//             </div>
//           </div>
//           {/* <div className="h-[52px] w-[52px] rounded-2xl bg-[#20BEF9] flex items-center justify-center text-[30px] text-[#004963] shadow-[0_0_10px_rgba(32,190,249,0.6)]">
//             +
//           </div> */}
//           <Dialog>
//             <DialogTrigger asChild>
//               <div className="h-[52px] w-[52px] rounded-2xl bg-[#20BEF9] flex items-center justify-center text-[30px] text-[#004963] shadow-[0_0_10px_rgba(32,190,249,0.6)] cursor-pointer">
//                 +
//               </div>
//             </DialogTrigger>
//             <DialogContent
//               className="w-[90%] rounded-2xl p-0 border-none"
//               aria-describedby={undefined}
//             >
//               <VisuallyHidden.Root>
//                 <DialogTitle>Create New Session</DialogTitle>
//               </VisuallyHidden.Root>
//               <CreateSession />
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="flex flex-col gap-5 mt-5 mx-5 pb-10">
//           {mockSessions.map((session) => {
//             const available = Number(session.availableSeats);
//             const capacity = Number(session.capacity);
//             const isFullyBooked = available >= capacity;
//             const isCancelled = !session.status;
//             const fillPercent = Math.min((available / capacity) * 100, 100);

//             // Progress bar өнгө
//             const barColor = isCancelled
//               ? "bg-red-300"
//               : isFullyBooked
//                 ? "bg-orange-400"
//                 : "bg-[#20BEF9]";

//             // Card зүүн хүрээний өнгө
//             const borderColor = isCancelled
//               ? "border-red-300"
//               : isFullyBooked
//                 ? "border-orange-400"
//                 : "border-[#20BEF9]";

//             return (
//               <div
//                 key={session.id}
//                 className={`bg-white shadow-md border-l-8 ${borderColor} rounded-[15px] flex flex-col gap-3 p-5 ${
//                   isCancelled ? "opacity-60" : ""
//                 }`}
//               >
//                 {/* Цаг */}
//                 {!isCancelled && (
//                   <div className="text-[#20BEF9] font-bold text-[13px]">
//                     {session.startTime} - {session.endTime}
//                   </div>
//                 )}

//                 {/* Гарчиг + edit товч */}
//                 <div className="flex justify-between items-start">
//                   <h2
//                     className={`font-extrabold ${
//                       isCancelled ? "line-through text-gray-400" : ""
//                     }`}
//                   >
//                     {session.title}
//                   </h2>
//                   <div className="bg-[#DAF2F9] h-[30px] w-[30px] flex items-center justify-center rounded-[10px] shrink-0">
//                     <Pencil className="h-[15px] w-[15px]" />
//                   </div>
//                 </div>

//                 {/* Багш + суудал */}
//                 <div className="flex gap-3">
//                   <div className="flex items-center gap-1">
//                     <CircleUser className="h-[15px] w-[15px] text-[#3D484F]" />
//                     <div className="text-[#3D484F] text-sm">
//                       {session.teacherName}
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <UsersRound className="h-[15px] w-[15px] text-[#3D484F]" />
//                     <div className="text-[#3D484F] text-sm">
//                       {session.availableSeats}/{session.capacity} Seats
//                     </div>
//                   </div>
//                 </div>

//                 {/* Progress bar */}
//                 <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full rounded-full ${barColor} transition-all`}
//                     style={{ width: `${fillPercent}%` }}
//                   />
//                 </div>

//                 {/* Status badge */}
//                 {isFullyBooked && !isCancelled && (
//                   <div className="mt-1">
//                     <span className="border border-orange-400 text-orange-500 text-[11px] font-extrabold px-3 py-1 rounded-md tracking-widest">
//                       FULLY BOOKED
//                     </span>
//                   </div>
//                 )}
//                 {isCancelled && (
//                   <div className="mt-1">
//                     <span className="bg-red-100 text-red-500 text-[11px] font-extrabold px-3 py-1 rounded-md tracking-widest flex items-center gap-1 w-fit">
//                       <XCircle className="h-[13px] w-[13px]" />
//                       CANCELLED (LOW ATTENDANCE)
//                     </span>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Session;

//HOPE IT WORKS

// Session.tsx
// "use client";
// import { CalendarIcon, Loader2, X } from "lucide-react";
// import React, { useState, useEffect } from "react";

// interface Teacher {
//   id: string;
//   fullName: string;
// }

// const BACKEND_URL = "https://tokalot.vercel.app";

// export default function CreateSession({ onClose }: { onClose?: () => void }) {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [loadingTeachers, setLoadingTeachers] = useState(true);

//   const today = new Date().toISOString().split("T")[0];

//   const [formData, setFormData] = useState({
//     title: "",
//     sessionDate: today,
//     startTime: "",
//     capacity: "15",
//     teacherId: "",
//   });

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         setLoadingTeachers(true);
//         const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });
//         if (!res.ok) throw new Error(`Teachers API error: ${res.status}`);
//         const data = await res.json();
//         setTeachers(Array.isArray(data) && data.length > 0 ? data : []);
//       } catch (err) {
//         console.error("Failed to fetch teachers:", err);
//         setTeachers([]);
//       } finally {
//         setLoadingTeachers(false);
//       }
//     };
//     fetchTeachers();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       if (!formData.title || !formData.teacherId || !formData.startTime || !formData.sessionDate) {
//         setError("Бүх талбарыг бөглөнө үү.");
//         setLoading(false);
//         return;
//       }

//       const [h, m] = formData.startTime.split(":").map(Number);
//       const endHour = String((h + 1) % 24).padStart(2, "0");
//       const endTime = `${endHour}:${String(m).padStart(2, "0")}`;

//       const payload = {
//         title: formData.title,
//         level: "Beginner",
//         teacherId: formData.teacherId,
//         StartTime: `${formData.sessionDate}T${formData.startTime}:00`,
//         endTime: `${formData.sessionDate}T${endTime}:00`,
//         capacity: formData.capacity,
//       };

//       console.log("Sending payload:", payload);

//       const res = await fetch(`${BACKEND_URL}/api/admin-section`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         let errorMessage = `Server error: ${res.status}`;
//         try {
//           const errorData = await res.json();
//           console.error("Server response:", errorData);
//           errorMessage = errorData.message || errorData.error || errorMessage;
//         } catch (_) {}
//         throw new Error(errorMessage);
//       }

//       const responseData = await res.json();
//       console.log("Session created:", responseData);

//       setSuccess(true);
//       setFormData({
//         title: "",
//         sessionDate: today,
//         startTime: "",
//         capacity: "15",
//         teacherId: "",
//       });

//       setTimeout(() => {
//         onClose?.();
//         window.location.reload();
//       }, 1500);
//     } catch (err) {
//       const errorMsg = err instanceof Error ? err.message : "Алдаа гарлаа";
//       setError(errorMsg);
//       console.error("Submit error:", errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="bg-[#E0F8FF] rounded-2xl p-6 flex flex-col gap-4 items-center justify-center min-h-[400px]">
//         <div className="text-green-500 text-5xl">✓</div>
//         <h2 className="font-extrabold text-lg">Амжилттай үүслээ!</h2>
//         <p className="text-sm text-gray-600">Session системд нэмэгдлээ</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#E0F8FF] rounded-2xl p-5 flex flex-col gap-3 relative">
//       {/* Close button */}
//       <button
//         onClick={onClose}
//         className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
//         type="button"
//       >
//         <X className="h-5 w-5" />
//       </button>

//       {/* Header */}
//       <div className="flex items-center gap-3 mt-6 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3">
//         <div className="bg-[#C2E8FF] p-2 rounded-xl">
//           <CalendarIcon className="h-5 w-5 text-[#006688]" />
//         </div>
//         <h2 className="font-extrabold text-lg">Create New Session</h2>
//       </div>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
//           ⚠️ {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//         {/* Session Name */}
//         <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             SESSION NAME
//           </label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             className="bg-transparent outline-none text-sm placeholder-gray-400"
//             placeholder="e.g. TOEFL Speaking Practice"
//           />
//         </div>

//         {/* Session Date */}
//         <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             SESSION DATE
//           </label>
//           <input
//             type="date"
//             name="sessionDate"
//             value={formData.sessionDate}
//             onChange={handleChange}
//             required
//             className="bg-transparent outline-none text-sm"
//           />
//         </div>

//         {/* Start Time + Seats */}
//         <div className="flex gap-3">
//           <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//             <label className="text-xs font-extrabold tracking-widest text-gray-500">
//               START TIME
//             </label>
//             <input
//               type="time"
//               name="startTime"
//               value={formData.startTime}
//               onChange={handleChange}
//               required
//               className="bg-transparent outline-none text-sm"
//             />
//           </div>
//           <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//             <label className="text-xs font-extrabold tracking-widest text-gray-500">
//               SEATS
//             </label>
//             <input
//               type="number"
//               name="capacity"
//               value={formData.capacity}
//               onChange={handleChange}
//               min="1"
//               className="bg-transparent outline-none text-sm"
//             />
//           </div>
//         </div>

//         {/* Teacher */}
//         <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             TEACHER
//           </label>
//           <select
//             name="teacherId"
//             value={formData.teacherId}
//             onChange={handleChange}
//             required
//             disabled={loadingTeachers}
//             className="bg-transparent outline-none text-sm text-gray-700"
//           >
//             <option value="">
//               {loadingTeachers
//                 ? "Багш ачаалж байна..."
//                 : teachers.length === 0
//                   ? "Багш олдоогүй"
//                   : "Select a Teacher"}
//             </option>
//             {teachers.map((teacher) => (
//               <option key={teacher.id} value={teacher.id}>
//                 {teacher.fullName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading || loadingTeachers}
//           className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl mt-1 disabled:opacity-50 flex items-center justify-center gap-2"
//         >
//           {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//           {loading ? "ҮҮСГЭЖ БУЙ..." : "PUBLISH SESSION"}
//         </button>
//       </form>
//     </div>
//   );
// }

//FINAL VERSION WITH ALL FEATURES, HOPE IT WORKS
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
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

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function isoToDateInput(iso: string) {
  try {
    return new Date(iso).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

function isoToTimeInput(iso: string) {
  try {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

// ── Edit Form ──────────────────────────────────────────────────────────────

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
  const { getToken } = useAuth();
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
      const token = await getToken();
      const payload = {
        title: form.title,
        level: section.level || "Beginner",
        teacherId: form.teacherId,
        StartTime: `${form.sessionDate}T${form.startTime}:00`,
        endTime: `${form.sessionDate}T${form.endTime}:00`,
        capacity: Number(form.capacity),
      };
      const res = await fetch(
        `${BACKEND_URL}/api/admin-section/${section.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err.message || err.error || `Server error: ${res.status}`,
        );
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
    setError("");
    try {
      const token = await getToken();
      const res = await fetch(
        `${BACKEND_URL}/api/admin-section/${section.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Устгахад алдаа гарлаа");
    } finally {
      setDeleting(false);
    }
  };

  const inputCls = "bg-transparent outline-none text-sm w-full";

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
          className={`${inputCls} text-gray-700`}
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
        {loading ? "ХАДГАЛЖ БУЙ..." : "SAVE SESSION"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="border-2 border-red-400 text-red-500 font-extrabold tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 bg-white"
      >
        {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
        {deleting ? "УСТГАЖ БУЙ..." : "DELETE SESSION"}
      </button>
    </form>
  );
}

// ── Session Card ───────────────────────────────────────────────────────────

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
  const fullyBooked = !cancelled && enrolled >= cap;
  const fillPct = Math.min((enrolled / cap) * 100, 100);
  const color = cancelled ? "#fca5a5" : enrolled >= cap ? "#f59e0b" : "#20BEF9";

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <p className="text-xs font-bold mb-1" style={{ color: "#20BEF9" }}>
        {formatTime(section.StartTime)} - {formatTime(section.endTime)}
      </p>
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`font-extrabold text-base leading-tight ${cancelled ? "text-gray-400" : "text-gray-800"}`}
        >
          {section.title}
        </h3>
        {cancelled ? (
          <Lock className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
        ) : (
          <button
            onClick={onEdit}
            className="bg-gray-100 hover:bg-gray-200 p-1.5 rounded-xl transition flex-shrink-0"
          >
            <PencilIcon className="h-3.5 w-3.5 text-gray-500" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <User className="h-3.5 w-3.5" />
          {section.teacher?.fullName ?? "—"}
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <Users className="h-3.5 w-3.5" />
          {enrolled}/{cap} Seats
        </span>
      </div>
      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${fillPct}%`, backgroundColor: color }}
        />
      </div>
      {fullyBooked && (
        <div className="mt-2">
          <span className="text-xs font-extrabold tracking-widest px-3 py-1 rounded-full border border-amber-300 text-amber-600 bg-amber-50">
            FULLY BOOKED
          </span>
        </div>
      )}
      {cancelled && (
        <div className="mt-2 flex items-center gap-1">
          <span className="text-red-400 text-sm">⊗</span>
          <span className="text-xs font-extrabold tracking-widest text-red-400">
            CANCELLED (LOW ATTENDANCE)
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main Session Component ─────────────────────────────────────────────────

export default function Session() {
  const { getToken } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [sheet, setSheet] = useState<null | "create" | Section>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openSheet = (s: "create" | Section) => {
    if (timer.current) clearTimeout(timer.current);
    setSheet(s);
    requestAnimationFrame(() => setVisible(true));
  };

  const closeSheet = () => {
    setVisible(false);
    timer.current = setTimeout(() => setSheet(null), 350);
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const fetchSections = async () => {
    try {
      setLoadingSections(true);
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin-section`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setSections(Array.isArray(data) ? data : []);
    } catch {
      setSections([]);
    } finally {
      setLoadingSections(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("failed");
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

  const now = new Date();

  return (
    <div className="relative">
      <div className="px-5 py-3">
        <button className="flex items-center gap-2 bg-[#E0F8FF] text-[#006688] font-bold text-sm px-4 py-2 rounded-full">
          <CalendarIcon className="h-4 w-4" />
          {now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          <span className="text-xs">▾</span>
        </button>
      </div>

      <div className="mx-5 mb-4 bg-[#E0F8FF] rounded-2xl px-4 py-3 flex items-start gap-2">
        <Info className="h-4 w-4 text-[#006688] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#006688] leading-relaxed">
          <span className="font-extrabold">Auto-Cancellation:</span> Sessions
          with &lt;3 participants 48h before start are automatically cancelled
          and closed.
        </p>
      </div>

      <div className="px-5 flex items-center justify-between mb-4">
        <div>
          <h2 className="font-extrabold text-2xl text-gray-900">
            Today's Sessions
          </h2>
          <p className="text-sm text-gray-500">
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => openSheet("create")}
          className="bg-[#20BEF9] text-white rounded-2xl p-3 shadow-lg hover:bg-[#00aaee] transition active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="px-5 flex flex-col gap-3 pb-6">
        {loadingSections ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#20BEF9]" />
          </div>
        ) : sections.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">
            Session байхгүй байна
          </p>
        ) : (
          sections.map((s) => (
            <SessionCard key={s.id} section={s} onEdit={() => openSheet(s)} />
          ))
        )}
      </div>

      {sheet !== null && (
        <>
          <div
            onClick={closeSheet}
            className="fixed inset-0 z-20 transition-opacity duration-300"
            style={{
              backgroundColor: visible ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
            }}
          />
          <div
            className="fixed left-0 right-0 bottom-0 z-30 bg-[#E0F8FF] rounded-t-3xl px-5 pt-3 pb-16 shadow-2xl overflow-y-auto max-h-[92vh]"
            style={{
              transform: visible ? "translateY(0)" : "translateY(100%)",
              transition: "transform 350ms cubic-bezier(0.32,0.72,0,1)",
            }}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-5" />
            {sheet === "create" ? (
              <CreateSession onClose={closeSheet} onSuccess={handleSuccess} />
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
