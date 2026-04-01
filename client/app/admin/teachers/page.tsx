// "use client";

// import { useState, useEffect } from "react";
// import { Search, Pencil, UserPlus } from "lucide-react";
// import Link from "next/link";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { addTeacher } from "@/app/testMock/mockTeachers";

// export default function TeachersPage() {
//   const [teachersData, setTeachersData] = useState<any[]>([]);
//   const [query, setQuery] = useState("");

//   useEffect(() => {
//     getTeachers().then(setTeachersData);
//   }, []);

//   const filteredTeachers = teachersData.filter((teacher) => {
//     const search = query.toLowerCase();
//     return (
//       teacher.name.toLowerCase().includes(search) ||
//       teacher.subject.toLowerCase().includes(search) ||
//       teacher.experience.toLowerCase().includes(search) ||
//       teacher.tags.some((tag: string) => tag.toLowerCase().includes(search))
//     );
//   });

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
//             <button className="w-[54px] h-[48px] bg-black text-white rounded-xl flex items-center justify-center shadow">
//               <UserPlus />
//             </button>
//           </Link>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mt-6">
//           <div className="bg-blue-100 p-6 rounded-2xl shadow">
//             <p className="text-3xl font-bold">{teachersData.length}</p>
//             <p className="text-sm tracking-widest text-gray-600">
//               ACTIVE STAFF
//             </p>
//           </div>
//         </div>

//         <div className="mt-6 relative">
//           <Search className="absolute left-4 top-3 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by name, subject, tag..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 rounded-2xl bg-blue-50 outline-none"
//           />
//         </div>

//         <div className="mt-6 space-y-4">
//           {filteredTeachers.map((teacher, i) => (
//             <div
//               key={i}
//               className="bg-white rounded-2xl p-4 flex items-center justify-between shadow"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   src={teacher.image || "/placeholder.png"}
//                   className="w-14 h-14 rounded-xl object-cover"
//                 />
//                 <div>
//                   <h3 className="font-semibold text-lg">{teacher.name}</h3>
//                   <p className="text-cyan-600 text-sm">{teacher.subject}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {teacher.experience} Level
//                   </p>
//                   <div className="flex gap-2 mt-2 flex-wrap">
//                     {teacher.tags.map((tag: string, idx: number) => (
//                       <span
//                         key={idx}
//                         className="text-xs bg-blue-100 px-3 py-1 rounded-full"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <button className="bg-blue-100 p-3 rounded-xl hover:bg-blue-200">
//                 <Pencil size={16} />
//               </button>
//             </div>
//           ))}

//           {filteredTeachers.length === 0 && (
//             <p className="text-center text-gray-400 mt-10">No teachers found</p>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
