// import { CalendarIcon } from "lucide-react";
// import React from "react";

// export default function CreateSession() {
//   return (
//     <div className="bg-[#E0F8FF] rounded-2xl p-6 flex flex-col gap-4">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="bg-[#C2E8FF] p-2 rounded-xl">
//           <CalendarIcon className="h-5 w-5 text-[#006688]" />
//         </div>
//         <h2 className="font-extrabold text-lg">Create New Session</h2>
//       </div>

//       {/* Session Name */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           SESSION NAME
//         </label>
//         <input
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           placeholder="e.g. TOEFL Speaking Practice"
//         />
//       </div>

//       {/* Session Date */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           SESSION DATE
//         </label>
//         <input
//           type="date"
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//         />
//       </div>

//       {/* Start Time + Seats */}
//       <div className="flex gap-3">
//         <div className="flex flex-col gap-1 flex-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             START TIME
//           </label>
//           <input
//             type="time"
//             className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           />
//         </div>
//         <div className="flex flex-col gap-1 flex-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             SEATS
//           </label>
//           <input
//             type="number"
//             defaultValue={15}
//             className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           />
//         </div>
//       </div>

//       {/* Teacher */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           TEACHER
//         </label>
//         <select className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm text-gray-500">
//           <option value="">Select a Teacher</option>
//           <option value="teacher1">Teacher 1</option>
//           <option value="teacher2">Teacher 2</option>
//         </select>
//       </div>

//       {/* Submit */}
//       <button className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl mt-2">
//         PUBLISH SESSION
//       </button>
//     </div>
//   );
// }

// CreateSession.tsx
// "use client";
// import { CalendarIcon, Loader2 } from "lucide-react";
// import React, { useState, useEffect } from "react";

// interface Teacher {
//   id: string;
//   fullName: string;
// }

// export default function CreateSession({ onClose }: { onClose?: () => void }) {
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const [formData, setFormData] = useState({
//     title: "",
//     level: "Beginner",
//     teacherId: "",
//     startTime: "",
//     endTime: "",
//     capacity: "15",
//   });

//   // Багшнуудыг авах - /api/admin/teachers
//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const res = await fetch(`/api/admin/teachers`);
//         if (!res.ok) throw new Error("Teachers ачаалахад алдаа");
//         const data = await res.json();
//         setTeachers(data);
//       } catch (err) {
//         console.error("Failed to fetch teachers:", err);
//         setError("Багш нарыг ачаалахад алдаа гарлаа");
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
//       if (
//         !formData.title ||
//         !formData.teacherId ||
//         !formData.startTime ||
//         !formData.endTime
//       ) {
//         setError("Бүх өрөс заавал");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         title: formData.title,
//         level: formData.level,
//         teacherId: formData.teacherId,
//         startTime: formData.startTime,
//         endTime: formData.endTime,
//         capacity: parseInt(formData.capacity),
//       };

//       // Session үүсгэх - /api/admin-section (POST)
//       const res = await fetch(`/api/admin-section`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Session үүсгэхэд алдаа");
//       }

//       setSuccess(true);
//       setFormData({
//         title: "",
//         level: "Beginner",
//         teacherId: "",
//         startTime: "",
//         endTime: "",
//         capacity: "15",
//       });

//       setTimeout(() => {
//         onClose?.();
//         window.location.reload();
//       }, 1500);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Алдаа гарлаа");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="bg-[#E0F8FF] rounded-2xl p-6 flex flex-col gap-4 items-center justify-center min-h-[400px]">
//         <div className="text-green-500 text-4xl">✓</div>
//         <h2 className="font-extrabold text-lg">Амжилттай үүслээ!</h2>
//         <p className="text-sm text-gray-600">Session системд нэмэгдлээ</p>
//       </div>
//     );
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-[#E0F8FF] rounded-2xl p-6 flex flex-col gap-4"
//     >
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="bg-[#C2E8FF] p-2 rounded-xl">
//           <CalendarIcon className="h-5 w-5 text-[#006688]" />
//         </div>
//         <h2 className="font-extrabold text-lg">Create New Session</h2>
//       </div>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
//           {error}
//         </div>
//       )}

//       {/* Session Name */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           SESSION NAME
//         </label>
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           placeholder="e.g. TOEFL Speaking Practice"
//         />
//       </div>

//       {/* Level */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           LEVEL
//         </label>
//         <select
//           name="level"
//           value={formData.level}
//           onChange={handleChange}
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm text-gray-700"
//         >
//           <option value="Beginner">Beginner</option>
//           <option value="Intermediate">Intermediate</option>
//           <option value="Advanced">Advanced</option>
//         </select>
//       </div>

//       {/* Teacher */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           TEACHER
//         </label>
//         <select
//           name="teacherId"
//           value={formData.teacherId}
//           onChange={handleChange}
//           required
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm text-gray-700"
//         >
//           <option value="">Select a Teacher</option>
//           {teachers.length === 0 ? (
//             <option disabled>Багш алга</option>
//           ) : (
//             teachers.map((teacher) => (
//               <option key={teacher.id} value={teacher.id}>
//                 {teacher.fullName}
//               </option>
//             ))
//           )}
//         </select>
//       </div>

//       {/* Start Time + End Time */}
//       <div className="flex gap-3">
//         <div className="flex flex-col gap-1 flex-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             START TIME
//           </label>
//           <input
//             type="time"
//             name="startTime"
//             value={formData.startTime}
//             onChange={handleChange}
//             required
//             className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           />
//         </div>
//         <div className="flex flex-col gap-1 flex-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             END TIME
//           </label>
//           <input
//             type="time"
//             name="endTime"
//             value={formData.endTime}
//             onChange={handleChange}
//             required
//             className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           />
//         </div>
//       </div>

//       {/* Capacity */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           CAPACITY
//         </label>
//         <input
//           type="number"
//           name="capacity"
//           value={formData.capacity}
//           onChange={handleChange}
//           min="1"
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//         />
//       </div>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
//       >
//         {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//         {loading ? "ҮҮСГЭЖ БУЙ..." : "PUBLISH SESSION"}
//       </button>
//     </form>
//   );
// }

// "use client";
// import { CalendarIcon, Loader2 } from "lucide-react";
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

//   const [formData, setFormData] = useState({
//     title: "",
//     level: "Beginner",
//     teacherId: "",
//     startTime: "",
//     endTime: "",
//     capacity: "15",
//   });

//   // Багшнуудыг авах
//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         setLoadingTeachers(true);

//         const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!res.ok) {
//           throw new Error(`Teachers API error: ${res.status}`);
//         }

//         const data = await res.json();

//         if (Array.isArray(data) && data.length > 0) {
//           setTeachers(data);
//         } else {
//           setTeachers([]);
//         }
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
//       // Validation
//       if (
//         !formData.title ||
//         !formData.teacherId ||
//         !formData.startTime ||
//         !formData.endTime
//       ) {
//         setError("Бүх өрөс заавал");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         title: formData.title,
//         level: formData.level,
//         teacherId: formData.teacherId,
//         startTime: formData.startTime,
//         endTime: formData.endTime,
//         capacity: parseInt(formData.capacity),
//       };

//       console.log("Sending payload:", payload);

//       // Session үүсгэх - local /api/admin-section (Next.js proxy)
//       const res = await fetch(`/api/admin-section`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         let errorMessage = "Session үүсгэхэд алдаа";
//         try {
//           const errorData = await res.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (e) {
//           errorMessage = `Server error: ${res.status}`;
//         }
//         throw new Error(errorMessage);
//       }

//       const responseData = await res.json();
//       console.log("Session created:", responseData);

//       setSuccess(true);
//       setFormData({
//         title: "",
//         level: "Beginner",
//         teacherId: "",
//         startTime: "",
//         endTime: "",
//         capacity: "15",
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
//         <div className="text-green-500 text-4xl">✓</div>
//         <h2 className="font-extrabold text-lg">Амжилттай үүслээ!</h2>
//         <p className="text-sm text-gray-600">Session системд нэмэгдлээ</p>
//       </div>
//     );
//   }

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-[#E0F8FF] rounded-2xl p-6 flex flex-col gap-4"
//     >
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="bg-[#C2E8FF] p-2 rounded-xl">
//           <CalendarIcon className="h-5 w-5 text-[#006688]" />
//         </div>
//         <h2 className="font-extrabold text-lg">Create New Session</h2>
//       </div>

//       {error && (
//         <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
//           {error}
//         </div>
//       )}

//       {/* Session Name */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           SESSION NAME
//         </label>
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           placeholder="e.g. TOEFL Speaking Practice"
//         />
//       </div>

//       {/* Level */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           LEVEL
//         </label>
//         <select
//           name="level"
//           value={formData.level}
//           onChange={handleChange}
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm text-gray-700"
//         >
//           <option value="Beginner">Beginner</option>
//           <option value="Intermediate">Intermediate</option>
//           <option value="Advanced">Advanced</option>
//         </select>
//       </div>

//       {/* Teacher */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           TEACHER
//         </label>
//         <select
//           name="teacherId"
//           value={formData.teacherId}
//           onChange={handleChange}
//           required
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm text-gray-700"
//           disabled={loadingTeachers}
//         >
//           <option value="">
//             {loadingTeachers
//               ? "Багш ачаалж байна..."
//               : teachers.length === 0
//                 ? "Багш олдоогүй"
//                 : "Select a Teacher"}
//           </option>
//           {teachers.map((teacher) => (
//             <option key={teacher.id} value={teacher.id}>
//               {teacher.fullName}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Start Time + End Time */}
//       <div className="flex gap-3">
//         <div className="flex flex-col gap-1 flex-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             START TIME
//           </label>
//           <input
//             type="time"
//             name="startTime"
//             value={formData.startTime}
//             onChange={handleChange}
//             required
//             className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           />
//         </div>
//         <div className="flex flex-col gap-1 flex-1">
//           <label className="text-xs font-extrabold tracking-widest text-gray-500">
//             END TIME
//           </label>
//           <input
//             type="time"
//             name="endTime"
//             value={formData.endTime}
//             onChange={handleChange}
//             required
//             className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//           />
//         </div>
//       </div>

//       {/* Capacity */}
//       <div className="flex flex-col gap-1">
//         <label className="text-xs font-extrabold tracking-widest text-gray-500">
//           CAPACITY
//         </label>
//         <input
//           type="number"
//           name="capacity"
//           value={formData.capacity}
//           onChange={handleChange}
//           min="1"
//           className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
//         />
//       </div>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         disabled={loading || loadingTeachers}
//         className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
//       >
//         {loading && <Loader2 className="h-4 w-4 animate-spin" />}
//         {loading ? "ҮҮСГЭЖ БУЙ..." : "PUBLISH SESSION"}
//       </button>
//     </form>
//   );
// }

//FINAL VERSION WITH ALL FEATURES, HOPE IT WORKS
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
}: {
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    title: "",
    sessionDate: today,
    startTime: "",
    endTime: "",
    capacity: "15",
    teacherId: "",
  });

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
        throw new Error(errData.message || errData.error || `Server error: ${res.status}`);
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
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">⚠️ {error}</div>
      )}

      <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">SESSION NAME</label>
        <input type="text" name="title" value={form.title} onChange={set} required
          placeholder="e.g. TOEFL Speaking Practice" className={inputCls} />
      </div>

      <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">SESSION DATE</label>
        <input type="date" name="sessionDate" value={form.sessionDate} onChange={set} required className={inputCls} />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
          <label className="text-xs font-extrabold tracking-widest text-gray-500">START TIME</label>
          <input type="time" name="startTime" value={form.startTime} onChange={set} required className={inputCls} />
        </div>
        <div className="flex-1 bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
          <label className="text-xs font-extrabold tracking-widest text-gray-500">END TIME</label>
          <input type="time" name="endTime" value={form.endTime} onChange={set} required className={inputCls} />
        </div>
      </div>

      <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">SEATS</label>
        <input type="number" name="capacity" value={form.capacity} onChange={set} min="1" className={inputCls} />
      </div>

      <div className="bg-[#D6F4FF] border border-[#A8E6FA] rounded-xl px-4 py-3 flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">TEACHER</label>
        <select name="teacherId" value={form.teacherId} onChange={set} required
          disabled={loadingTeachers} className={`${inputCls} text-gray-700`}>
          <option value="">
            {loadingTeachers ? "Багш ачаалж байна..." : teachers.length === 0 ? "Багш олдоогүй" : "Select a Teacher"}
          </option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>{t.fullName}</option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading || loadingTeachers}
        className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl mt-1 disabled:opacity-50 flex items-center justify-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "ҮҮСГЭЖ БУЙ..." : "PUBLISH SESSION"}
      </button>
    </form>
  );
}