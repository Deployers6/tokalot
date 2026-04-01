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



"use client";
import { CalendarIcon, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

interface Teacher {
  id: string;
  fullName: string;
}

const BACKEND_URL = "https://tokalot-git-55-tekugiin-haraal-idse-78bab1-deployers6s-projects.vercel.app";

export default function CreateSession({ onClose }: { onClose?: () => void }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    level: "Beginner",
    teacherId: "",
    startTime: "",
    endTime: "",
    capacity: "15",
  });

  // Багшнуудыг авах
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/admin/teachers`);
        const data = await res.json();
        setTeachers(data);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        setError("Багш нарыг ачаалахад алдаа гарлаа");
      }
    };
    fetchTeachers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        title: formData.title,
        level: formData.level,
        teacherId: formData.teacherId,
        StartTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`,
        capacity: parseInt(formData.capacity),
      };

      const res = await fetch(`${BACKEND_URL}/api/admin-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Session үүсгэхад алдаа");

      setSuccess(true);
      setFormData({
        title: "",
        level: "Beginner",
        teacherId: "",
        startTime: "",
        endTime: "",
        capacity: "15",
      });

      setTimeout(() => {
        onClose?.();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#E0F8FF] rounded-2xl p-6 flex flex-col gap-4 items-center justify-center min-h-[400px]">
        <div className="text-green-500 text-4xl">✓</div>
        <h2 className="font-extrabold text-lg">Амжилттай үүслээ!</h2>
        <p className="text-sm text-gray-600">Session бүргүүдэлээ</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#E0F8FF] rounded-2xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-[#C2E8FF] p-2 rounded-xl">
          <CalendarIcon className="h-5 w-5 text-[#006688]" />
        </div>
        <h2 className="font-extrabold text-lg">Create New Session</h2>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">{error}</div>}

      {/* Session Name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">SESSION NAME</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
          placeholder="e.g. TOEFL Speaking Practice"
        />
      </div>

      {/* Level */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">LEVEL</label>
        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm text-gray-700"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Teacher */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">TEACHER</label>
        <select
          name="teacherId"
          value={formData.teacherId}
          onChange={handleChange}
          required
          className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm text-gray-700"
        >
          <option value="">Select a Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Start Time + End Time */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-extrabold tracking-widest text-gray-500">START TIME</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-extrabold tracking-widest text-gray-500">END TIME</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
          />
        </div>
      </div>

      {/* Capacity */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-extrabold tracking-widest text-gray-500">CAPACITY</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          min="1"
          className="rounded-xl px-4 py-3 bg-white border-none outline-none text-sm"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#20BEF9] text-white font-extrabold tracking-widest py-4 rounded-xl mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? "Үүсгэж байна..." : "PUBLISH SESSION"}
      </button>
    </form>
  );
}