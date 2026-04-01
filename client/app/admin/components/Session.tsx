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

//THIRD VERSION WITH BACKEND

// "use client";
// import React from "react";
// import { useState, useEffect } from "react";
// import DatePicker from "./Calendar";
// import {
//   CircleAlert,
//   Pencil,
//   CircleUser,
//   UsersRound,
//   XCircle,
//   Loader,
// } from "lucide-react";

// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
//   DialogTitle,
// } from "../components/ui/dialog";

// import CreateSession from "./CreateSession";
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

// const BACKEND_URL =
//   "https://tokalot-git-55-tekugiin-haraal-idse-78bab1-deployers6s-projects.vercel.app";

// interface BackendSession {
//   id: string;
//   title: string;
//   level: string;
//   teacherId: string;
//   StartTime: string;
//   endTime: string;
//   capacity: number;
//   status: boolean;
//   teacher: { fullName: string };
// }

// interface Session {
//   id: string;
//   title: string;
//   teacherName: string;
//   startTime: string;
//   endTime: string;
//   capacity: number;
//   availableSeats: number;
//   status: boolean;
// }

// const Session = () => {
//   const today = new Date();
//   const [selected, setSelected] = useState<{
//     day: number;
//     month: number;
//     year: number;
//   } | null>(null);

//   // Backend дээр авсан session state
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const displayDate = selected
//     ? new Date(selected.year, selected.month, selected.day)
//     : today;

//   const dayName = DAYS[displayDate.getDay()];
//   const monthName = MONTHS[displayDate.getMonth()];
//   const dayNum = displayDate.getDate();

//   // Backend дээр session авах
//   useEffect(() => {
//     const fetchSessions = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/admin-section`);
//         if (!res.ok) throw new Error("Failed to fetch sessions");

//         const data: BackendSession[] = await res.json();

//         // Backend data → component format руу хөрвүүлэх
//         const transformedSessions: Session[] = data.map((session) => {
//           const startDate = new Date(session.StartTime);
//           const endDate = new Date(session.endTime);

//           const startTime = startDate.toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//           });

//           const endTime = endDate.toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//           });

//           return {
//             id: session.id,
//             title: session.title,
//             teacherName: session.teacher.fullName,
//             startTime,
//             endTime,
//             capacity: session.capacity,
//             availableSeats: session.capacity, // TODO: booking-ын logic оруулах
//             status: session.status,
//           };
//         });

//         setSessions(transformedSessions);
//       } catch (err) {
//         console.error("Failed to fetch sessions:", err);
//         setError("Session нарыг ачаалахад алдаа гарлаа");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSessions();
//   }, []);

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

//           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//             <DialogTrigger asChild>
//               <div className="h-[52px] w-[52px] rounded-2xl bg-[#20BEF9] flex items-center justify-center text-[30px] text-[#004963] shadow-[0_0_10px_rgba(32,190,249,0.6)] cursor-pointer hover:shadow-lg transition-shadow">
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
//               <CreateSession onClose={() => setDialogOpen(false)} />
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Loading state */}
//         {loading && (
//           <div className="flex items-center justify-center py-10">
//             <Loader className="h-6 w-6 animate-spin text-[#20BEF9]" />
//             <span className="ml-2 text-gray-600">
//               Session нарыг ачаалаж байна...
//             </span>
//           </div>
//         )}

//         {/* Error state */}
//         {error && !loading && (
//           <div className="mx-5 mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
//             {error}
//           </div>
//         )}

//         {/* Sessions list */}
//         <div className="flex flex-col gap-5 mt-5 mx-5 pb-10">
//           {sessions.length === 0 && !loading && (
//             <div className="text-center py-10 text-gray-500">
//               Одоогоор session байхгүй байна
//             </div>
//           )}

//           {sessions.map((session) => {
//             const available = Number(session.availableSeats);
//             const capacity = Number(session.capacity);
//             const isFullyBooked = available >= capacity;
//             const isCancelled = !session.status;
//             const fillPercent = Math.min((available / capacity) * 100, 100);

//             const barColor = isCancelled
//               ? "bg-red-300"
//               : isFullyBooked
//                 ? "bg-orange-400"
//                 : "bg-[#20BEF9]";

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
//                 {!isCancelled && (
//                   <div className="text-[#20BEF9] font-bold text-[13px]">
//                     {session.startTime} - {session.endTime}
//                   </div>
//                 )}

//                 <div className="flex justify-between items-start">
//                   <h2
//                     className={`font-extrabold ${
//                       isCancelled ? "line-through text-gray-400" : ""
//                     }`}
//                   >
//                     {session.title}
//                   </h2>
//                   <div className="bg-[#DAF2F9] h-[30px] w-[30px] flex items-center justify-center rounded-[10px] shrink-0 cursor-pointer hover:bg-[#B0E0FF]">
//                     <Pencil className="h-[15px] w-[15px]" />
//                   </div>
//                 </div>

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

//                 <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full rounded-full ${barColor} transition-all`}
//                     style={{ width: `${fillPercent}%` }}
//                   />
//                 </div>

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


//FIFTH VERSION WITH FIXED 


"use client";
import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "./Calendar";
import {
  CircleAlert,
  Pencil,
  CircleUser,
  UsersRound,
  XCircle,
  Loader,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "../components/ui/dialog";

import CreateSession from "./CreateSession";
import { mockSessions } from "../lib/mockSessions";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const BACKEND_URL = "https://tokalot-git-55-tekugiin-haraal-idse-78bab1-deployers6s-projects.vercel.app";

interface BackendSession {
  id: string;
  title: string;
  level: string;
  teacherId: string;
  StartTime: string;
  endTime: string;
  capacity: number;
  status: boolean;
  teacher: { fullName: string };
}

interface Session {
  id: string;
  title: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  capacity: number;
  availableSeats: number;
  status: boolean;
}

const SessionComponent = () => {
  const today = new Date();
  const [selected, setSelected] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [usesMockData, setUsesMockData] = useState(false);

  const displayDate = selected
    ? new Date(selected.year, selected.month, selected.day)
    : today;

  const dayName = DAYS[displayDate.getDay()];
  const monthName = MONTHS[displayDate.getMonth()];
  const dayNum = displayDate.getDate();

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError("");
      
      try {
        console.log("Fetching from:", `${BACKEND_URL}/api/admin-section`);
        
        const res = await fetch(`${BACKEND_URL}/api/admin-section`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", res.status);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log("Backend data received:", data);

        // Backend data → component format руу хөрвүүлэх
        const transformedSessions: Session[] = data.map((session: BackendSession) => {
          const startDate = new Date(session.StartTime);
          const endDate = new Date(session.endTime);

          const startTime = startDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          const endTime = endDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });

          return {
            id: session.id,
            title: session.title,
            teacherName: session.teacher.fullName,
            startTime,
            endTime,
            capacity: session.capacity,
            availableSeats: session.capacity,
            status: session.status,
          };
        });

        setSessions(transformedSessions);
        setUsesMockData(false);
      } catch (err) {
        console.error("❌ Backend fetch failed:", err);
        
        // Fallback to mock data
        console.log("⚠️ Using mock data as fallback");
        const mockTransformed = mockSessions.map((session: any) => ({
          id: String(session.id),
          title: session.title,
          teacherName: session.teacherName,
          startTime: session.startTime,
          endTime: session.endTime,
          capacity: Number(session.capacity),
          availableSeats: Number(session.availableSeats),
          status: session.status,
        }));
        
        setSessions(mockTransformed);
        setError("Backend нь ажиллахгүй байгаа. Mock data ашигладаг байна.");
        setUsesMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col justify-between bg-white">
      <div className="overflow-y-auto">
        <div className="w-screen mt-5 pl-5 border-b pb-5 border-[#BCC8D1]">
          <DatePicker selected={selected} setSelected={setSelected} />
        </div>

        <div className="w-[358px] h-[61px] bg-[#C2E8FF] border border-[#20BEF9] rounded-[8px] mt-5 flex ml-4 gap-2 px-2">
          <CircleAlert className="h-[20px] w-[20px] mt-0.5 shrink-0" />
          <div className="mt-1">
            <p className="text-[11px] font-extrabold">Auto-Cancellation:</p>
            <p className="text-[11px]">
              Sessions with under 3 participants 48h before start are
              automatically cancelled and closed.
            </p>
          </div>
        </div>

        <div className="flex w-screen justify-between px-5 mt-5">
          <div>
            <div className="font-extrabold text-lg">Sessions</div>
            <div className="text-gray-500 text-sm">
              {dayName}, {monthName} {dayNum}
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <div className="h-[52px] w-[52px] rounded-2xl bg-[#20BEF9] flex items-center justify-center text-[30px] text-[#004963] shadow-[0_0_10px_rgba(32,190,249,0.6)] cursor-pointer hover:shadow-lg transition-shadow">
                +
              </div>
            </DialogTrigger>
            <DialogContent
              className="w-[90%] rounded-2xl p-0 border-none"
              aria-describedby={undefined}
            >
              <VisuallyHidden.Root>
                <DialogTitle>Create New Session</DialogTitle>
              </VisuallyHidden.Root>
              <CreateSession onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader className="h-6 w-6 animate-spin text-[#20BEF9]" />
            <span className="ml-2 text-gray-600">Session нарыг ачаалаж байна...</span>
          </div>
        )}

        {error && !loading && (
          <div className="mx-5 mt-5 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col gap-5 mt-5 mx-5 pb-10">
          {sessions.length === 0 && !loading && (
            <div className="text-center py-10 text-gray-500">
              Одоогоор session байхгүй байна
            </div>
          )}

          {sessions.map((session) => {
            const available = Number(session.availableSeats);
            const capacity = Number(session.capacity);
            const isFullyBooked = available >= capacity;
            const isCancelled = !session.status;
            const fillPercent = Math.min((available / capacity) * 100, 100);

            const barColor = isCancelled
              ? "bg-red-300"
              : isFullyBooked
                ? "bg-orange-400"
                : "bg-[#20BEF9]";

            const borderColor = isCancelled
              ? "border-red-300"
              : isFullyBooked
                ? "border-orange-400"
                : "border-[#20BEF9]";

            return (
              <div
                key={session.id}
                className={`bg-white shadow-md border-l-8 ${borderColor} rounded-[15px] flex flex-col gap-3 p-5 ${
                  isCancelled ? "opacity-60" : ""
                }`}
              >
                {!isCancelled && (
                  <div className="text-[#20BEF9] font-bold text-[13px]">
                    {session.startTime} - {session.endTime}
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <h2
                    className={`font-extrabold ${
                      isCancelled ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {session.title}
                  </h2>
                  <div className="bg-[#DAF2F9] h-[30px] w-[30px] flex items-center justify-center rounded-[10px] shrink-0 cursor-pointer hover:bg-[#B0E0FF]">
                    <Pencil className="h-[15px] w-[15px]" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <CircleUser className="h-[15px] w-[15px] text-[#3D484F]" />
                    <div className="text-[#3D484F] text-sm">
                      {session.teacherName}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersRound className="h-[15px] w-[15px] text-[#3D484F]" />
                    <div className="text-[#3D484F] text-sm">
                      {session.availableSeats}/{session.capacity} Seats
                    </div>
                  </div>
                </div>

                <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>

                {isFullyBooked && !isCancelled && (
                  <div className="mt-1">
                    <span className="border border-orange-400 text-orange-500 text-[11px] font-extrabold px-3 py-1 rounded-md tracking-widest">
                      FULLY BOOKED
                    </span>
                  </div>
                )}
                {isCancelled && (
                  <div className="mt-1">
                    <span className="bg-red-100 text-red-500 text-[11px] font-extrabold px-3 py-1 rounded-md tracking-widest flex items-center gap-1 w-fit">
                      <XCircle className="h-[13px] w-[13px]" />
                      CANCELLED (LOW ATTENDANCE)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SessionComponent;