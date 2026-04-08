// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "@clerk/nextjs";
// import { Search, Pencil, UserPlus, Trash2 } from "lucide-react";
// import Link from "next/link";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import Image from "next/image";

// const BACKEND_URL =
//   process.env.NEXT_PUBLIC_BACKEND_URL || "https://tokalot.vercel.app";

// interface Teacher {
//   id: string;
//   fullName: string;
//   bio: string;
//   experience: string;
//   imageUrl: string;
// }

// export default function TeachersPage() {
//   const { getToken } = useAuth();
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [query, setQuery] = useState("");

//   const fetchData = async () => {
//     try {
//       const token = await getToken();

//       const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         console.error("Failed to fetch teachers:", res.status, text);
//         setTeachers([]);
//         return;
//       }

//       const data = await res.json();

//       if (!Array.isArray(data)) {
//         console.warn("Expected an array but got:", data);
//         setTeachers([]);
//       } else {
//         setTeachers(data);
//       }
//     } catch (err) {
//       console.error("Failed to fetch teachers:", err);
//       setTeachers([]);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [getToken]);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Энэ багшийг устгах уу?")) return;

//     try {
//       const token = await getToken();

//       const res = await fetch(`${BACKEND_URL}/api/admin/teachers?id=${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         alert(data?.error || "Зөвхөн өөрийн нэмсэн багшийг устгах боломжтой");
//         return;
//       }

//       await fetchData();
//     } catch (err) {
//       console.error("Failed to delete teacher:", err);
//       alert("Устгахад алдаа гарлаа");
//     }
//   };

//   const filteredTeachers = Array.isArray(teachers)
//     ? teachers.filter((t) => {
//         const q = query.toLowerCase();
//         return (
//           t.fullName.toLowerCase().includes(q) ||
//           t.experience.toLowerCase().includes(q) ||
//           t.bio.toLowerCase().includes(q)
//         );
//       })
//     : [];

//   return (
//     <div className="min-h-screen bg-gray-100 pb-24">
//       <Header />
//       <div className="p-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-sm text-gray-500">FACULTY DIRECTORY</p>
//             <h2 className="text-3xl font-bold">Teachers</h2>
//           </div>
//           <Link href="/admin/add-new-teacher">
//             <button className="w-[64px] h-[58px] bg-black text-white rounded-xl flex items-center justify-center shadow">
//               <UserPlus />
//             </button>
//           </Link>
//         </div>

//         <div className="grid gap-4 mt-6">
//           <div className="bg-[#EFEFEF] p-6 rounded-2xl shadow">
//             <p className="text-3xl font-bold">{teachers.length}</p>
//             <p className="text-sm tracking-widest text-gray-600">TEACHERS</p>
//           </div>
//         </div>

//         <div className="mt-6 relative">
//           <Search className="absolute left-4 top-3 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name or level..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#EFEFEF] outline-none shadow text-sm"
//           />
//         </div>

//         <div className="mt-6 space-y-4">
//           {filteredTeachers.length > 0 ? (
//             filteredTeachers.map((teacher) => (
//               <div
//                 key={teacher.id}
//                 className="bg-white rounded-2xl p-4 flex items-center justify-between shadow"
//               >
//                 <div className="flex items-center gap-4">
//                   <Image
//                     src={teacher.imageUrl || "/default-profile.png"}
//                     alt={teacher.fullName}
//                     width={56}
//                     height={56}
//                     className="w-14 h-14 rounded-xl object-cover"
//                   />
//                   <div>
//                     <h3 className="font-semibold text-lg">
//                       {teacher.fullName}
//                     </h3>
//                     <p className="text-cyan-600 text-sm">
//                       {teacher.experience}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-1">{teacher.bio}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Link href={`/admin/edit-teacher-profile/${teacher.id}`}>
//                     <button className="bg-[#DAF2F9] p-3 rounded-xl hover:bg-blue-200">
//                       <Pencil size={16} />
//                     </button>
//                   </Link>
//                   <button
//                     onClick={() => handleDelete(teacher.id)}
//                     className="bg-red-100 p-3 rounded-xl hover:bg-red-200"
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-gray-400 mt-10">No teachers found</p>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Search, Pencil, UserPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://tokalot.vercel.app";

interface Teacher {
  id: string;
  fullName: string;
  bio: string;
  experience: string;
  imageUrl: string;
}

export default function TeachersPage() {
  const { getToken } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setTeachers([]);
        return;
      }

      const data = await res.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
      setTeachers([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [getToken]);

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ багшийг устгах уу?")) return;
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/api/admin/teachers?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Зөвхөн өөрийн нэмсэн багшийг устгах боломжтой");
        return;
      }
      await fetchData();
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      alert("Устгахад алдаа гарлаа");
    }
  };

  const filteredTeachers = Array.isArray(teachers)
    ? teachers.filter((t) => {
        const q = query.toLowerCase();
        return (
          t.fullName.toLowerCase().includes(q) ||
          t.experience.toLowerCase().includes(q) ||
          t.bio.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    // Desktop дээр саарал nền-тэй, голдоо Phone frame-тэй Wrapper
    <div className="min-h-screen w-full bg-[#F1F5F9] md:flex md:items-center md:justify-center">
      <div
        className="relative w-full h-screen bg-white shadow-2xl overflow-hidden flex flex-col
                      md:max-w-[430px] md:h-[90vh] md:rounded-[45px] md:border-white"
      >
        {/* Header - Контейнерын ирмэгт тулна */}
        <Header />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-[100px] scrollbar-hide bg-[#F8FDFF]">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  FACULTY DIRECTORY
                </p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                  Teachers
                </h2>
              </div>
              <Link href="/admin/add-new-teacher">
                <button className="w-[58px] h-[58px] bg-black text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition">
                  <UserPlus size={24} />
                </button>
              </Link>
            </div>

            {/* Stats Card */}
            <div className="grid gap-4 mt-6">
              <div className="bg-[#EFEFEF] p-6 rounded-[28px] border border-gray-100">
                <p className="text-4xl font-black text-gray-900">
                  {teachers.length}
                </p>
                <p className="text-[10px] font-black tracking-[3px] text-gray-500 uppercase mt-1">
                  TOTAL TEACHERS
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="mt-6 relative">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or bio..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#EFEFEF] outline-none border border-transparent focus:border-[#20BEF9] transition text-sm font-bold"
              />
            </div>

            {/* Teachers List */}
            <div className="mt-8 space-y-4">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="bg-white rounded-[28px] p-5 flex items-center justify-between shadow-sm border border-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 shrink-0">
                        <Image
                          src={teacher.imageUrl || "/default-profile.png"}
                          alt={teacher.fullName}
                          fill
                          className="rounded-2xl object-cover"
                        />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-black text-gray-800 text-lg leading-tight truncate">
                          {teacher.fullName}
                        </h3>
                        <p className="text-[#20BEF9] text-xs font-black uppercase tracking-wider mt-1">
                          {teacher.experience}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium mt-1 truncate">
                          {teacher.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-2">
                      <Link href={`/admin/edit-teacher-profile/${teacher.id}`}>
                        <button className="bg-[#DAF2F9] p-3 rounded-2xl text-[#006688] active:scale-90 transition">
                          <Pencil size={16} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="bg-red-50 p-3 rounded-2xl text-red-400 active:scale-90 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-gray-300 font-black uppercase text-xs tracking-[4px]">
                    No teachers found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Контейнерын ирмэгт тулна */}
        <Footer />
      </div>
    </div>
  );
}
