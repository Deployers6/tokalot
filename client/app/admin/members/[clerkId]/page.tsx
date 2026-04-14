// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useAuth } from "@clerk/nextjs";
// import {
//   ArrowLeft,
//   User,
//   ChevronDown,
//   Pencil,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   X,
//   UserRound,
//   Loader2,
// } from "lucide-react";

// const BACKEND_URL = "https://tokalot.vercel.app";

// type MembershipStatus = "ACTIVE" | "PENDING" | "EXPIRED";

// interface HistoryItem {
//   id: string;
//   action: string;
//   change: number;
//   createdAt: string;
// }

// interface UserDetail {
//   clerkId: string;
//   fullName: string;
//   email?: string;
//   image?: string;
// }

// interface MembershipData {
//   clerkId: string;
//   startDate?: string;
//   endDate?: string;
//   totalSessions: number;
//   usedSessions: number;
//   status: string;
//   history: HistoryItem[];
// }

// const STATUS_CONFIG = {
//   ACTIVE: { label: "Active", icon: "✅", color: "text-green-600" },
//   PENDING: { label: "Pending", icon: "🟡", color: "text-yellow-500" },
//   EXPIRED: { label: "Expired", icon: "❌", color: "text-red-500" },
// };

// const normalizeStatus = (s?: string): MembershipStatus => {
//   if (s === "ACTIVE") return "ACTIVE";
//   if (s === "EXPIRED") return "EXPIRED";
//   return "PENDING";
// };

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
// const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

// const toLocalDateString = (d: Date | null) => {
//   if (!d) return null;
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// function isSameDay(a: Date, b: Date) {
//   return (
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate()
//   );
// }
// function isBetween(d: Date, start: Date, end: Date) {
//   return d > start && d < end;
// }
// function startOfDay(d: Date) {
//   const c = new Date(d);
//   c.setHours(0, 0, 0, 0);
//   return c;
// }

// interface DateRangePickerProps {
//   startDate: Date | null;
//   endDate: Date | null;
//   onChange: (start: Date | null, end: Date | null) => void;
//   onClose: () => void;
// }

// function DateRangePicker({
//   startDate,
//   endDate,
//   onChange,
//   onClose,
// }: DateRangePickerProps) {
//   const today = startOfDay(new Date());
//   const [viewYear, setViewYear] = useState(
//     startDate ? startDate.getFullYear() : today.getFullYear(),
//   );
//   const [viewMonth, setViewMonth] = useState(
//     startDate ? startDate.getMonth() : today.getMonth(),
//   );
//   const [selecting, setSelecting] = useState<"start" | "end">("start");
//   const [hovered, setHovered] = useState<Date | null>(null);

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

//   const firstDay = new Date(viewYear, viewMonth, 1).getDay();
//   const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
//   const cells: (Date | null)[] = [
//     ...Array(firstDay).fill(null),
//     ...Array.from({ length: daysInMonth }, (_, i) =>
//       startOfDay(new Date(viewYear, viewMonth, i + 1)),
//     ),
//   ];

//   const handleDayClick = (day: Date) => {
//     if (selecting === "start") {
//       onChange(day, null);
//       setSelecting("end");
//     } else {
//       if (startDate && day < startDate) onChange(day, startDate);
//       else onChange(startDate, day);
//       setSelecting("start");
//     }
//   };

//   const getDayStyle = (day: Date) => {
//     const isStart = startDate && isSameDay(day, startDate);
//     const isEnd = endDate && isSameDay(day, endDate);
//     const isToday = isSameDay(day, today);
//     const hoverEnd =
//       selecting === "end" &&
//       hovered &&
//       startDate &&
//       day <= hovered &&
//       day >= startDate;
//     const inRange =
//       startDate && endDate
//         ? isBetween(day, startDate, endDate)
//         : hoverEnd && !isStart;
//     let bg = "bg-transparent",
//       text = "text-gray-800",
//       rounded = "rounded-full",
//       fw = "font-medium";
//     if (isStart || isEnd) {
//       bg = "bg-[#20BEF9]";
//       text = "text-white";
//       fw = "font-bold";
//     } else if (inRange) {
//       bg = "bg-[#D7F4FD]";
//       text = "#0088B3";
//       rounded = "rounded-none";
//     }
//     if (isStart && endDate) rounded = "rounded-l-full rounded-r-none";
//     if (isEnd && startDate) rounded = "rounded-r-full rounded-l-none";
//     if (isToday && !isStart && !isEnd) text = "text-[#20BEF9] font-bold";
//     return `${bg} ${text} ${rounded} ${fw}`;
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
//       <div className="w-full max-w-[430px] bg-white rounded-t-[40px] shadow-2xl pb-10 animate-slide-up">
//         <div className="flex items-center justify-between px-6 pt-6 pb-4">
//           <div>
//             <p className="text-xl font-black text-gray-900">
//               {MONTHS[viewMonth]} {viewYear}
//             </p>
//             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
//               {selecting === "start" ? "Select start date" : "Select end date"}
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={prevMonth}
//               className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100"
//             >
//               <ChevronLeft size={18} />
//             </button>
//             <button
//               onClick={nextMonth}
//               className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100"
//             >
//               <ChevronRight size={18} />
//             </button>
//             <button
//               onClick={onClose}
//               className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-900 text-white ml-2"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>
//         <div className="grid grid-cols-7 px-4 mb-2">
//           {DAYS.map((d, i) => (
//             <div
//               key={i}
//               className="text-center text-[10px] font-black text-gray-300 py-2"
//             >
//               {d}
//             </div>
//           ))}
//         </div>
//         <div className="grid grid-cols-7 px-4 gap-y-1">
//           {cells.map((day, i) =>
//             day ? (
//               <button
//                 key={i}
//                 onClick={() => handleDayClick(day)}
//                 onMouseEnter={() => setHovered(day)}
//                 onMouseLeave={() => setHovered(null)}
//                 className={`h-10 w-full flex items-center justify-center text-sm transition-all ${getDayStyle(day)}`}
//               >
//                 {day.getDate()}
//               </button>
//             ) : (
//               <div key={i} />
//             ),
//           )}
//         </div>
//         {startDate && endDate && (
//           <div className="px-6 mt-6">
//             <button
//               onClick={onClose}
//               className="w-full h-[60px] bg-black text-white font-black uppercase tracking-[2px] rounded-2xl shadow-xl active:scale-95 transition"
//             >
//               Confirm Period
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function EditUserPage() {
//   const params = useParams();
//   const clerkId = params?.clerkId as string;
//   const router = useRouter();
//   const { userId } = useAuth();

//   const [user, setUser] = useState<UserDetail | null>(null);
//   const [membership, setMembership] = useState<MembershipData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [fullName, setFullName] = useState("");
//   const [membershipStatus, setMembershipStatus] =
//     useState<MembershipStatus>("PENDING");
//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);
//   const [sessionUsed, setSessionUsed] = useState(0);
//   const [sessionTotal, setSessionTotal] = useState(0);
//   const [editingSessions, setEditingSessions] = useState(false);
//   const [membershipStart, setMembershipStart] = useState<Date | null>(null);
//   const [membershipEnd, setMembershipEnd] = useState<Date | null>(null);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [membershipDeleted, setMembershipDeleted] = useState(false);

//   useEffect(() => {
//     if (userId && clerkId) fetchAll();
//   }, [userId, clerkId]);

//   const fetchAll = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const usersRes = await fetch(`${BACKEND_URL}/api/admin/get-user`, {
//         headers: { "x-admin-id": userId ?? "" },
//       });
//       const usersData = await usersRes.json();
//       const users = Array.isArray(usersData)
//         ? usersData
//         : (usersData?.users ?? []);
//       const found = users.find((u: any) => u.clerkId === clerkId);
//       if (!found) {
//         setError("User not found");
//         return;
//       }
//       setUser(found);
//       setFullName(found.fullName ?? "");

//       const memRes = await fetch(`${BACKEND_URL}/api/admin/membership`, {
//         headers: { "x-user-id": clerkId, "x-admin-id": userId ?? "" },
//       });
//       let memData: MembershipData | null = null;
//       if (memRes.ok) memData = await memRes.json();

//       setMembership(memData);
//       setMembershipStatus(normalizeStatus(memData?.status));
//       setSessionUsed(memData?.usedSessions ?? 0);
//       setSessionTotal(memData?.totalSessions ?? 0);

//       if (memData?.startDate) {
//         const p = memData.startDate.split("T")[0].split("-");
//         setMembershipStart(
//           new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])),
//         );
//       }
//       if (memData?.endDate) {
//         const p = memData.endDate.split("T")[0].split("-");
//         setMembershipEnd(
//           new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])),
//         );
//       }
//     } catch (err: any) {
//       setError(err.message ?? "Failed to load");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       const parts = fullName.trim().split(" ");
//       await fetch(`${BACKEND_URL}/api/admin/patch-user`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           targetClerkId: clerkId,
//           adminClerkId: userId,
//           firstName: parts[0] ?? "",
//           lastName: parts.slice(1).join(" "),
//         }),
//       });

//       if (!membershipDeleted) {
//         await fetch(`${BACKEND_URL}/api/admin/membership`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json", "x-user-id": clerkId },
//           body: JSON.stringify({
//             clerkId,
//             startDate: toLocalDateString(membershipStart),
//             endDate: toLocalDateString(membershipEnd),
//             totalSessions: sessionTotal,
//             usedSessions: sessionUsed,
//             status: membershipStatus,
//           }),
//         });
//       }
//       router.back();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ targetClerkId: clerkId, adminClerkId: userId }),
//       });
//       router.back();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeleteMembership = async () => {
//     setShowStatusDropdown(false);
//     if (!confirm("Устгах уу?")) return;
//     try {
//       const res = await fetch(`${BACKEND_URL}/api/admin/membership`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json", "x-user-id": clerkId },
//         body: JSON.stringify({ clerkId }),
//       });
//       if (!res.ok) throw new Error("Failed");
//       setMembership(null);
//       setMembershipStatus("PENDING");
//       setSessionUsed(0);
//       setSessionTotal(0);
//       setMembershipStart(null);
//       setMembershipEnd(null);
//       setMembershipDeleted(true);
//     } catch (err) {
//       alert("Алдаа гарлаа");
//     }
//   };

//   const statusCfg = STATUS_CONFIG[membershipStatus];
//   const remaining = Math.max(sessionTotal - sessionUsed, 0);
//   const sessionPct = sessionTotal > 0 ? (sessionUsed / sessionTotal) * 100 : 0;

//   const formatPeriod = () => {
//     if (!membershipStart && !membershipEnd) return "Tap to set period";
//     const fmt = (d: Date) =>
//       d.toLocaleDateString("en-US", {
//         month: "short",
//         day: "2-digit",
//         year: "numeric",
//       });
//     return membershipStart && membershipEnd
//       ? `${fmt(membershipStart)} – ${fmt(membershipEnd)}`
//       : membershipStart
//         ? `From ${fmt(membershipStart)}`
//         : "—";
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen w-full bg-[#F1F5F9] flex items-center justify-center">
//         <Loader2 className="animate-spin text-[#20BEF9]" size={32} />
//       </div>
//     );

//   return (
//     <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
//       <style>{`
//         @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//         .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1); }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//       `}</style>

//       <div
//         className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
//                       md:max-w-[430px] md:h-[90vh] md:rounded-[45px] md:border-white"
//       >
//         {/* Sticky Header */}
//         <div className="w-full h-[60px] bg-black text-white flex items-center justify-between px-5 shrink-0 z-40">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#20BEF9]"
//           >
//             <ArrowLeft size={16} /> Back
//           </button>
//           <p className="text-sm font-black tracking-tight">Edit Student</p>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="text-xs font-black uppercase tracking-widest text-[#20BEF9] disabled:opacity-30"
//           >
//             {saving ? "..." : "Save"}
//           </button>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto pb-[120px] scrollbar-hide bg-[#F8FDFF]">
//           {/* Avatar Section */}
//           <div className="flex flex-col items-center pt-10 pb-6">
//             <div className="relative">
//               <div className="bg-gray-100 rounded-[40px] h-[100px] w-[100px] flex items-center justify-center border-4 border-white shadow-sm">
//                 <UserRound className="h-[60px] w-[60px] text-gray-300" />
//               </div>
//             </div>
//             {membershipStatus === "EXPIRED" && (
//               <div className="mt-4 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full">
//                 <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
//                   Membership Expired
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="px-6 space-y-6">
//             {/* Full Name */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
//                 Full Name
//               </label>
//               <div className="flex items-center gap-3 bg-[#EFEFEF] rounded-2xl px-5 h-[60px]">
//                 <User size={18} className="text-gray-400" />
//                 <input
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   className="flex-1 bg-transparent font-bold text-gray-800 outline-none"
//                   placeholder="Name"
//                 />
//               </div>
//             </div>

//             {/* Membership Status */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
//                 Status
//               </label>
//               <div className="relative">
//                 <button
//                   onClick={() => setShowStatusDropdown(!showStatusDropdown)}
//                   className="w-full flex items-center justify-between bg-[#EFEFEF] rounded-2xl px-5 h-[60px]"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-lg">{statusCfg.icon}</span>
//                     <span className={`font-black ${statusCfg.color}`}>
//                       {statusCfg.label}
//                     </span>
//                   </div>
//                   <ChevronDown
//                     className={`text-gray-400 transition ${showStatusDropdown ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {showStatusDropdown && (
//                   <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
//                     {(Object.keys(STATUS_CONFIG) as MembershipStatus[]).map(
//                       (s) => (
//                         <button
//                           key={s}
//                           onClick={() => {
//                             setMembershipStatus(s);
//                             setShowStatusDropdown(false);
//                           }}
//                           className="w-full px-6 py-4 flex items-center gap-3 font-black text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50"
//                         >
//                           <span>{STATUS_CONFIG[s].icon}</span>
//                           <span className={STATUS_CONFIG[s].color}>
//                             {STATUS_CONFIG[s].label}
//                           </span>
//                         </button>
//                       ),
//                     )}
//                     <button
//                       onClick={handleDeleteMembership}
//                       className="w-full px-6 py-4 flex items-center gap-3 font-black text-sm text-red-500 bg-red-50/50"
//                     >
//                       <Trash2 size={16} /> Delete Membership
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Membership Period */}
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
//                 Period
//               </label>
//               <button
//                 onClick={() => setShowCalendar(true)}
//                 className="w-full flex items-center gap-4 bg-[#EFEFEF] rounded-2xl px-5 h-[70px] text-left"
//               >
//                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
//                   📅
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p
//                     className={`font-black text-sm truncate ${membershipStart ? "text-gray-800" : "text-gray-400"}`}
//                   >
//                     {formatPeriod()}
//                   </p>
//                 </div>
//                 <Pencil size={14} className="text-gray-400" />
//               </button>
//             </div>

//             {/* Session Credits */}
//             <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-[#E0F8FF] flex items-center justify-center text-lg">
//                     🎫
//                   </div>
//                   <div>
//                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
//                       Credits
//                     </p>
//                     {editingSessions ? (
//                       <div className="flex items-center gap-1 font-black text-sm">
//                         <input
//                           type="number"
//                           value={sessionUsed}
//                           onChange={(e) =>
//                             setSessionUsed(Number(e.target.value))
//                           }
//                           className="w-12 bg-gray-50 border rounded px-1"
//                         />
//                         <span>/</span>
//                         <input
//                           type="number"
//                           value={sessionTotal}
//                           onChange={(e) =>
//                             setSessionTotal(Number(e.target.value))
//                           }
//                           className="w-12 bg-gray-50 border rounded px-1"
//                         />
//                       </div>
//                     ) : (
//                       <p className="font-black text-gray-800">
//                         {sessionUsed} used /{" "}
//                         <span
//                           className={
//                             remaining === 0 ? "text-red-500" : "text-[#20BEF9]"
//                           }
//                         >
//                           {remaining} left
//                         </span>
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setEditingSessions(!editingSessions)}
//                   className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
//                 >
//                   <Pencil size={14} className="text-gray-400" />
//                 </button>
//               </div>
//               <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//                 <div
//                   className={`h-full rounded-full transition-all duration-500 ${sessionPct >= 100 ? "bg-red-400" : "bg-[#20BEF9]"}`}
//                   style={{ width: `${Math.min(sessionPct, 100)}%` }}
//                 />
//               </div>
//             </div>

//             {/* History */}
//             {membership?.history && membership.history.length > 0 && (
//               <div className="space-y-3">
//                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
//                   Session History
//                 </h3>
//                 <div className="space-y-2">
//                   {membership.history.map((h) => (
//                     <div
//                       key={h.id}
//                       className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-50 shadow-sm"
//                     >
//                       <div>
//                         <p className="text-xs font-black text-gray-800">
//                           {h.action}
//                         </p>
//                         <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">
//                           {new Date(h.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <span
//                         className={`text-sm font-black ${h.change < 0 ? "text-red-400" : "text-green-500"}`}
//                       >
//                         {h.change > 0 ? `+${h.change}` : h.change}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <button
//               onClick={handleDelete}
//               className="w-full flex items-center justify-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest py-8 active:opacity-50 transition"
//             >
//               <Trash2 size={14} /> Delete Entire Profile
//             </button>
//           </div>
//         </div>

//         {/* Fixed Cancel Button at Bottom */}
//         <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-50">
//           <button
//             onClick={() => router.back()}
//             className="w-full h-[60px] rounded-2xl border-2 border-gray-100 font-black uppercase tracking-[2px] text-xs text-gray-400 active:bg-gray-50 transition"
//           >
//             Cancel Changes
//           </button>
//         </div>
//       </div>

//       {showCalendar && (
//         <DateRangePicker
//           startDate={membershipStart}
//           endDate={membershipEnd}
//           onChange={(s, e) => {
//             setMembershipStart(s);
//             setMembershipEnd(e);
//           }}
//           onClose={() => setShowCalendar(false)}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  ArrowLeft,
  User,
  ChevronDown,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  UserRound,
  Loader2,
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
      text = "#0088B3";
      rounded = "rounded-none";
    }
    if (isStart && endDate) rounded = "rounded-l-full rounded-r-none";
    if (isEnd && startDate) rounded = "rounded-r-full rounded-l-none";
    if (isToday && !isStart && !isEnd) text = "text-[#20BEF9] font-bold";
    return `${bg} ${text} ${rounded} ${fw}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-[430px] bg-white rounded-t-[40px] shadow-2xl pb-10 animate-slide-up">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <p className="text-xl font-black text-gray-900">
              {MONTHS[viewMonth]} {viewYear}
            </p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
              {selecting === "start" ? "Select start date" : "Select end date"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-900 text-white ml-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 px-4 mb-2">
          {DAYS.map((d, i) => (
            <div
              key={i}
              className="text-center text-[10px] font-black text-gray-300 py-2"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 px-4 gap-y-1">
          {cells.map((day, i) =>
            day ? (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                className={`h-10 w-full flex items-center justify-center text-sm transition-all ${getDayStyle(day)}`}
              >
                {day.getDate()}
              </button>
            ) : (
              <div key={i} />
            ),
          )}
        </div>
        {startDate && endDate && (
          <div className="px-6 mt-6">
            <button
              onClick={onClose}
              className="w-full h-[60px] bg-black text-white font-black uppercase tracking-[2px] rounded-2xl shadow-xl active:scale-95 transition"
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
  const [membershipDeleted, setMembershipDeleted] = useState(false);

  useEffect(() => {
    if (userId && clerkId) fetchAll();
  }, [userId, clerkId]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Хоёр request зэрэг явна
      const [usersRes, memRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/get-user`, {
          headers: { "x-admin-id": userId ?? "" },
        }),
        fetch(`${BACKEND_URL}/api/admin/membership`, {
          headers: { "x-user-id": clerkId, "x-admin-id": userId ?? "" },
        }),
      ]);

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

      let memData: MembershipData | null = null;
      if (memRes.ok) memData = await memRes.json();

      setMembership(memData);
      setMembershipStatus(normalizeStatus(memData?.status));
      setSessionUsed(memData?.usedSessions ?? 0);
      setSessionTotal(memData?.totalSessions ?? 0);

      if (memData?.startDate) {
        const p = memData.startDate.split("T")[0].split("-");
        setMembershipStart(
          new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])),
        );
      }
      if (memData?.endDate) {
        const p = memData.endDate.split("T")[0].split("-");
        setMembershipEnd(
          new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])),
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

      if (!membershipDeleted) {
        await fetch(`${BACKEND_URL}/api/admin/membership`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "x-user-id": clerkId },
          body: JSON.stringify({
            clerkId,
            startDate: toLocalDateString(membershipStart),
            endDate: toLocalDateString(membershipEnd),
            totalSessions: sessionTotal,
            usedSessions: sessionUsed,
            status: membershipStatus,
          }),
        });
      }
      router.back();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
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

  const handleDeleteMembership = async () => {
    setShowStatusDropdown(false);
    if (!confirm("Устгах уу?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/membership`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-user-id": clerkId },
        body: JSON.stringify({ clerkId }),
      });
      if (!res.ok) throw new Error("Failed");
      setMembership(null);
      setMembershipStatus("PENDING");
      setSessionUsed(0);
      setSessionTotal(0);
      setMembershipStart(null);
      setMembershipEnd(null);
      setMembershipDeleted(true);
    } catch (err) {
      alert("Алдаа гарлаа");
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
    return membershipStart && membershipEnd
      ? `${fmt(membershipStart)} – ${fmt(membershipEnd)}`
      : membershipStart
        ? `From ${fmt(membershipStart)}`
        : "—";
  };

  if (loading)
    return (
      <div className="min-h-screen w-full bg-[#F1F5F9] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#20BEF9]" size={32} />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col md:max-w-[430px] md:h-[90vh] md:rounded-[45px] md:border-white">
        {/* Sticky Header */}
        <div className="w-full h-[60px] bg-black text-white flex items-center justify-between px-5 shrink-0 z-40">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#20BEF9]"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <p className="text-sm font-black tracking-tight">Edit Student</p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs font-black uppercase tracking-widest text-[#20BEF9] disabled:opacity-30"
          >
            {saving ? "..." : "Save"}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-[120px] scrollbar-hide bg-[#F8FDFF]">
          {/* Avatar Section */}
          <div className="flex flex-col items-center pt-10 pb-6">
            <div className="relative">
              <div className="bg-gray-100 rounded-[40px] h-[100px] w-[100px] flex items-center justify-center border-4 border-white shadow-sm">
                <UserRound className="h-[60px] w-[60px] text-gray-300" />
              </div>
            </div>
            {membershipStatus === "EXPIRED" && (
              <div className="mt-4 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full">
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                  Membership Expired
                </span>
              </div>
            )}
          </div>

          <div className="px-6 space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                Full Name
              </label>
              <div className="flex items-center gap-3 bg-[#EFEFEF] rounded-2xl px-5 h-[60px]">
                <User size={18} className="text-gray-400" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 bg-transparent font-bold text-gray-800 outline-none"
                  placeholder="Name"
                />
              </div>
            </div>

            {/* Membership Status */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                Status
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="w-full flex items-center justify-between bg-[#EFEFEF] rounded-2xl px-5 h-[60px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{statusCfg.icon}</span>
                    <span className={`font-black ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <ChevronDown
                    className={`text-gray-400 transition ${showStatusDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
                    {(Object.keys(STATUS_CONFIG) as MembershipStatus[]).map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setMembershipStatus(s);
                            setShowStatusDropdown(false);
                          }}
                          className="w-full px-6 py-4 flex items-center gap-3 font-black text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50"
                        >
                          <span>{STATUS_CONFIG[s].icon}</span>
                          <span className={STATUS_CONFIG[s].color}>
                            {STATUS_CONFIG[s].label}
                          </span>
                        </button>
                      ),
                    )}
                    <button
                      onClick={handleDeleteMembership}
                      className="w-full px-6 py-4 flex items-center gap-3 font-black text-sm text-red-500 bg-red-50/50"
                    >
                      <Trash2 size={16} /> Delete Membership
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Membership Period */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                Period
              </label>
              <button
                onClick={() => setShowCalendar(true)}
                className="w-full flex items-center gap-4 bg-[#EFEFEF] rounded-2xl px-5 h-[70px] text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-black text-sm truncate ${membershipStart ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {formatPeriod()}
                  </p>
                </div>
                <Pencil size={14} className="text-gray-400" />
              </button>
            </div>

            {/* Session Credits */}
            <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E0F8FF] flex items-center justify-center text-lg">
                    🎫
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Credits
                    </p>
                    {editingSessions ? (
                      <div className="flex items-center gap-1 font-black text-sm">
                        <input
                          type="number"
                          value={sessionUsed}
                          onChange={(e) =>
                            setSessionUsed(Number(e.target.value))
                          }
                          className="w-12 bg-gray-50 border rounded px-1"
                        />
                        <span>/</span>
                        <input
                          type="number"
                          value={sessionTotal}
                          onChange={(e) =>
                            setSessionTotal(Number(e.target.value))
                          }
                          className="w-12 bg-gray-50 border rounded px-1"
                        />
                      </div>
                    ) : (
                      <p className="font-black text-gray-800">
                        {sessionUsed} used /{" "}
                        <span
                          className={
                            remaining === 0 ? "text-red-500" : "text-[#20BEF9]"
                          }
                        >
                          {remaining} left
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setEditingSessions(!editingSessions)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
                >
                  <Pencil size={14} className="text-gray-400" />
                </button>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${sessionPct >= 100 ? "bg-red-400" : "bg-[#20BEF9]"}`}
                  style={{ width: `${Math.min(sessionPct, 100)}%` }}
                />
              </div>
            </div>

            {/* History */}
            {membership?.history && membership.history.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">
                  Session History
                </h3>
                <div className="space-y-2">
                  {membership.history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-50 shadow-sm"
                    >
                      <div>
                        <p className="text-xs font-black text-gray-800">
                          {h.action}
                        </p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">
                          {new Date(h.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-black ${h.change < 0 ? "text-red-400" : "text-green-500"}`}
                      >
                        {h.change > 0 ? `+${h.change}` : h.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest py-8 active:opacity-50 transition"
            >
              <Trash2 size={14} /> Delete Entire Profile
            </button>
          </div>
        </div>

        {/* Fixed Cancel Button at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-50">
          <button
            onClick={() => router.back()}
            className="w-full h-[60px] rounded-2xl border-2 border-gray-100 font-black uppercase tracking-[2px] text-xs text-gray-400 active:bg-gray-50 transition"
          >
            Cancel Changes
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
    </div>
  );
}
