// "use client";
// import React, { useState } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Search, Calendar, Pencil } from "lucide-react";
// import { UserPlus } from "lucide-react";

// const mockStudents = [
//   {
//     id: 1,
//     name: "Alex Rivers",
//     enrolledDate: "Oct 12, 2023",
//     image: null,
//   },
//   {
//     id: 2,
//     name: "Jordan Lee",
//     enrolledDate: "Nov 05, 2023",
//     image: null,
//   },
// ];

// const User = () => {
//   const [search, setSearch] = useState("");

//   const filtered = mockStudents.filter((s) =>
//     s.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white">
//       <Header />

//       <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search students..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
//           />
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-extrabold text-gray-900">
//             Student Directory
//           </h1>
//           <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
//             {filtered.length} TOTAL
//           </span>
//         </div>

//         <div className="flex flex-col gap-3">
//           {filtered.map((student) => (
//             <div
//               key={student.id}
//               className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
//                   {student.image ? (
//                     <img
//                       src={student.image}
//                       alt={student.name}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-2xl">🧑</span>
//                   )}
//                 </div>
//                 <div>
//                   <p className="font-extrabold text-gray-900">{student.name}</p>
//                   <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
//                     <Calendar className="h-3 w-3" />
//                     <span>Enrolled: {student.enrolledDate}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl shrink-0">
//                 <Pencil className="h-4 w-4 text-gray-600" />

//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="absolute bottom-24 right-5">
//         <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
//           <UserPlus className="h-6 w-6" />
//         </button>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default User;

// "use client";

// import React, { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Search, Pencil, Trash2 } from "lucide-react";
// import { UserPlus } from "lucide-react";

// const BACKEND_URL = "https://tokalot.vercel.app";

// interface UserType {
//   id: string;
//   fullName: string;
//   isMember: boolean;
//   image?: string;
// }

// const User = () => {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ GET USERS
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BACKEND_URL}/api/admin/get-user`);
//       const data = await res.json();
//       setUsers(data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // 🔍 SEARCH
//   const filtered = users.filter((u) =>
//     u.fullName.toLowerCase().includes(search.toLowerCase()),
//   );

//   // ❌ DELETE USER
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;

//     try {
//       await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       // refresh
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white">
//       <Header />

//       <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
//         {/* SEARCH */}
//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search students..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
//           />
//         </div>

//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-extrabold text-gray-900">
//             Student Directory
//           </h1>
//           <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
//             {filtered.length} TOTAL
//           </span>
//         </div>

//         {/* LIST */}
//         <div className="flex flex-col gap-3">
//           {loading && <p>Loading...</p>}

//           {filtered.map((user) => (
//             <div
//               key={user.id}
//               className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 flex items-center justify-center">
//                   {user.image ? (
//                     <img
//                       src={user.image}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     "🧑"
//                   )}
//                 </div>

//                 <div>
//                   <p className="font-extrabold text-gray-900">
//                     {user.fullName}
//                   </p>

//                   {/* ✅ MEMBER STATUS */}
//                   <p className="text-sm text-gray-400">
//                     {user.isMember ? "Member ✅" : "Not Member ❌"}
//                   </p>
//                 </div>
//               </div>

//               {/* ACTIONS */}
//               <div className="flex gap-2">
//                 {/* EDIT */}
//                 <button className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl">
//                   <Pencil className="h-4 w-4 text-gray-600" />
//                 </button>

//                 {/* DELETE */}
//                 <button
//                   onClick={() => handleDelete(user.id)}
//                   className="bg-red-100 h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//                 >
//                   <Trash2 className="h-4 w-4 text-red-500" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ADD USER */}
//       <div className="absolute bottom-24 right-5">
//         <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
//           <UserPlus className="h-6 w-6" />
//         </button>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default User;

// "use client";

// import React, { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Search } from "lucide-react";
// import { UserPlus } from "lucide-react";

// import UserCard from "../members/components/UserCard";
// import EditUserModal from "../members/components/EditUserModal";

// const BACKEND_URL = "https://tokalot.vercel.app";

// interface UserType {
//   id: string;
//   fullName: string;
//   isMember: boolean;
//   image?: string;
// }

// const User = () => {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

//   // ✅ GET USERS
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BACKEND_URL}/api/admin/get-user`);
//       const data = await res.json();

//       // ⚠️ Хэрвээ backend { users: [...] } буцаавал:
//       setUsers(data.users || data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // 🔍 SEARCH
//   const filtered = users.filter((u) =>
//     u.fullName.toLowerCase().includes(search.toLowerCase())
//   );

//   // ❌ DELETE
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;

//     try {
//       await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white">
//       <Header />

//       <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
//         {/* SEARCH */}
//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search students..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
//           />
//         </div>

//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-extrabold text-gray-900">
//             Student Directory
//           </h1>
//           <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
//             {filtered.length} TOTAL
//           </span>
//         </div>

//         {/* LIST */}
//         <div className="flex flex-col gap-3">
//           {loading && <p>Loading...</p>}

//           {!loading && filtered.length === 0 && (
//             <p className="text-gray-400">No users found</p>
//           )}

//           {filtered.map((user) => (
//             <UserCard
//               key={user.id}
//               user={user}
//               onEdit={setSelectedUser}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ➕ ADD USER BUTTON */}
//       <div className="absolute bottom-24 right-5">
//         <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
//           <UserPlus className="h-6 w-6" />
//         </button>
//       </div>

//       {/* ✏️ EDIT MODAL */}
//       {selectedUser && (
//         <EditUserModal
//           user={selectedUser}
//           onClose={() => setSelectedUser(null)}
//           onSuccess={fetchUsers}
//         />
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default User;

// app/admin/members/page.tsx

//SECOND BUT FAILED TRY
// "use client";

// import React, { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Search } from "lucide-react";
// import { UserPlus, Pencil, Trash2 } from "lucide-react";

// const BACKEND_URL = "https://tokalot.vercel.app";

// interface UserType {
//   id: string;
//   fullName: string;
//   email: string;
//   isMember: boolean;
//   image?: string;
// }

// // ✅ UserCard Component
// const UserCard = ({
//   user,
//   onEdit,
//   onDelete,
// }: {
//   user: UserType;
//   onEdit: (user: UserType) => void;
//   onDelete: (id: string) => void;
// }) => (
//   <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
//     <div className="flex items-center gap-3">
//       <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
//         {user.image ? (
//           <img src={user.image} className="w-full h-full object-cover" />
//         ) : (
//           "🧑"
//         )}
//       </div>
//       <div>
//         <p className="font-extrabold text-gray-900">{user.fullName}</p>
//         <p className="text-sm text-gray-400">
//           {user.isMember ? "Member ✅" : "Not Member ❌"}
//         </p>
//       </div>
//     </div>
//     <div className="flex gap-2">
//       <button
//         onClick={() => onEdit(user)}
//         className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//       >
//         <Pencil className="h-4 w-4 text-gray-600" />
//       </button>
//       <button
//         onClick={() => onDelete(user.id)}
//         className="bg-red-100 h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//       >
//         <Trash2 className="h-4 w-4 text-red-500" />
//       </button>
//     </div>
//   </div>
// );

// // ✅ EditUserModal Component
// const EditUserModal = ({
//   user,
//   onClose,
//   onSuccess,
// }: {
//   user: UserType;
//   onClose: () => void;
//   onSuccess: () => void;
// }) => {
//   const [fullName, setFullName] = useState(user.fullName);
//   const [isMember, setIsMember] = useState(user.isMember);
//   const [loading, setLoading] = useState(false);

//   const handleUpdate = async () => {
//     try {
//       setLoading(true);
//       await fetch(`${BACKEND_URL}/api/admin/patch-user`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: user.id, fullName, isMember }),
//       });
//       onSuccess();
//       onClose();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white w-[90%] max-w-md rounded-2xl p-5">
//         <h2 className="text-xl font-bold mb-4">Edit User</h2>
//         <input
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           className="w-full mb-3 p-3 rounded-xl bg-gray-100 outline-none"
//           placeholder="Full name"
//         />
//         <div className="flex items-center justify-between mb-4">
//           <span>Member</span>
//           <input
//             type="checkbox"
//             checked={isMember}
//             onChange={(e) => setIsMember(e.target.checked)}
//           />
//         </div>
//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-gray-200"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleUpdate}
//             disabled={loading}
//             className="px-4 py-2 rounded-lg bg-black text-white"
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Main Page
// const User = () => {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

//   // GET USERS
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${BACKEND_URL}/api/admin/get-user`);
//       const data = await res.json();
//       // backend array эсэхийг шалгах
//       setUsers(Array.isArray(data.users) ? data.users : data);
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // SEARCH
//   const filtered = users.filter((u) =>
//     u.fullName.toLowerCase().includes(search.toLowerCase()),
//   );

//   // DELETE USER
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white">
//       <Header />
//       <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
//         {/* SEARCH */}
//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search students..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
//           />
//         </div>

//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-extrabold text-gray-900">
//             Student Directory
//           </h1>
//           <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
//             {filtered.length} TOTAL
//           </span>
//         </div>

//         {/* LIST */}
//         <div className="flex flex-col gap-3">
//           {loading && <p>Loading...</p>}
//           {!loading && filtered.length === 0 && (
//             <p className="text-gray-400">No users found</p>
//           )}
//           {filtered.map((user) => (
//             <UserCard
//               key={user.id}
//               user={user}
//               onEdit={setSelectedUser}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ADD USER BUTTON */}
//       <div className="absolute bottom-24 right-5">
//         <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
//           <UserPlus className="h-6 w-6" />
//         </button>
//       </div>

//       {/* EDIT MODAL */}
//       {selectedUser && (
//         <EditUserModal
//           user={selectedUser}
//           onClose={() => setSelectedUser(null)}
//           onSuccess={fetchUsers}
//         />
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default User;

//THIRD BUT HOPED TRY
// "use client";

// import React, { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Search, UserPlus } from "lucide-react";
// import UserCard from "../members/components/UserCard";
// import EditUserModal from "../members/components/EditUserModal";

// const BACKEND_URL = "https://tokalot.vercel.app";

// interface UserType {
//   id: string;
//   clerkId: string;
//   fullName: string;
//   email?: string;
//   isMember: boolean;
//   image?: string;
// }

// const User = () => {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${BACKEND_URL}/api/admin/get-user`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include", // Clerk session cookie явуулна
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`${res.status}: ${errText}`);
//       }

//       const data = await res.json();

//       // Backend ямар хэлбэрээр буцааж байгааг handle хийнэ
//       if (Array.isArray(data)) {
//         setUsers(data);
//       } else if (Array.isArray(data?.users)) {
//         setUsers(data.users);
//       } else {
//         console.error("Unexpected API shape:", data);
//         setUsers([]);
//       }
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       setError(err.message ?? "Unknown error");
//       setUsers([]); // ← Энэ мөр байхгүй байсан учраас crash болж байсан
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ id }),
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // users нь заавал array байна гэдгийг баталгаажуулна
//   const filtered = Array.isArray(users)
//     ? users.filter((u) =>
//         u.fullName?.toLowerCase().includes(search.toLowerCase()),
//       )
//     : [];

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white">
//       <Header />
//       <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
//         {/* SEARCH */}
//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search students..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
//           />
//         </div>

//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-extrabold text-gray-900">
//             Student Directory
//           </h1>
//           <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
//             {filtered.length} TOTAL
//           </span>
//         </div>

//         {/* ERROR STATE */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
//             ⚠️ {error}
//           </div>
//         )}

//         {/* LIST */}
//         <div className="flex flex-col gap-3">
//           {loading && <p className="text-gray-400">Loading...</p>}
//           {!loading && !error && filtered.length === 0 && (
//             <p className="text-gray-400">No users found</p>
//           )}
//           {filtered.map((user) => (
//             <UserCard
//               key={user.id}
//               user={user}
//               onEdit={setSelectedUser}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ADD USER BUTTON */}
//       <div className="absolute bottom-24 right-5">
//         <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
//           <UserPlus className="h-6 w-6" />
//         </button>
//       </div>

//       {/* EDIT MODAL */}
//       {selectedUser && (
//         <EditUserModal
//           user={selectedUser}
//           onClose={() => setSelectedUser(null)}
//           onSuccess={fetchUsers}
//         />
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default User;

//LOL FOURTH TRY
// "use client";

// import React, { useState, useEffect } from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Search, UserPlus } from "lucide-react";
// import UserCard from "../members/components/UserCard";
// import EditUserModal from "../members/components/EditUserModal";

// const BACKEND_URL = "https://tokalot.vercel.app";

// interface UserType {
//   id: string;
//   clerkId: string;
//   fullName: string;
//   email?: string;
//   isMember: boolean;
//   image?: string;
// }

// const User = () => {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${BACKEND_URL}/api/admin/get-user`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         // credentials хасав — CORS error гарч байсан
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`${res.status}: ${errText}`);
//       }

//       const data = await res.json();

//       if (Array.isArray(data)) {
//         setUsers(data);
//       } else if (Array.isArray(data?.users)) {
//         setUsers(data.users);
//       } else {
//         console.error("Unexpected API shape:", data);
//         setUsers([]);
//       }
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       setError(err.message ?? "Unknown error");
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         // credentials хасав
//         body: JSON.stringify({ id }),
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filtered = Array.isArray(users)
//     ? users.filter((u) =>
//         u.fullName?.toLowerCase().includes(search.toLowerCase()),
//       )
//     : [];

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white">
//       <Header />
//       <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search students..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
//           />
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-extrabold text-gray-900">
//             Student Directory
//           </h1>
//           <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
//             {filtered.length} TOTAL
//           </span>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
//             ⚠️ {error}
//           </div>
//         )}

//         <div className="flex flex-col gap-3">
//           {loading && <p className="text-gray-400">Loading...</p>}
//           {!loading && !error && filtered.length === 0 && (
//             <p className="text-gray-400">No users found</p>
//           )}
//           {filtered.map((user) => (
//             <UserCard
//               key={user.id}
//               user={user}
//               onEdit={setSelectedUser}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="absolute bottom-24 right-5">
//         <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
//           <UserPlus className="h-6 w-6" />
//         </button>
//       </div>

//       {selectedUser && (
//         <EditUserModal
//           user={selectedUser}
//           onClose={() => setSelectedUser(null)}
//           onSuccess={fetchUsers}
//         />
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default User;

//FINAL VERSION
// "use client";

// import React, { useState, useEffect } from "react";
// import { useAuth } from "@clerk/nextjs";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { Search, UserPlus } from "lucide-react";
// import UserCard from "../members/components/UserCard";
// import EditUserModal from "../members/components/EditUserModal";

// const BACKEND_URL = "https://tokalot.vercel.app";

// interface UserType {
//   id: string;
//   clerkId: string;
//   fullName: string;
//   email?: string;
//   isMember: boolean;
//   image?: string;
// }

// const User = () => {
//   const { userId } = useAuth();
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<UserType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${BACKEND_URL}/api/admin/get-user`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "x-admin-id": userId ?? "",
//         },
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`${res.status}: ${errText}`);
//       }

//       const data = await res.json();

//       if (Array.isArray(data)) {
//         setUsers(data);
//       } else if (Array.isArray(data?.users)) {
//         setUsers(data.users);
//       } else {
//         setUsers([]);
//       }
//     } catch (err: any) {
//       console.error("Fetch error:", err);
//       setError(err.message ?? "Unknown error");
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId) fetchUsers();
//   }, [userId]);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           "x-admin-id": userId ?? "",
//         },
//         body: JSON.stringify({ id }),
//       });
//       fetchUsers();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filtered = Array.isArray(users)
//     ? users.filter((u) =>
//         u.fullName?.toLowerCase().includes(search.toLowerCase()),
//       )
//     : [];

//   return (
//     <div className="h-screen w-screen flex flex-col bg-white">
//       <Header />
//       <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
//         <div className="relative mb-6">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search students..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
//           />
//         </div>

//         <div className="flex items-center justify-between mb-4">
//           <h1 className="text-2xl font-extrabold text-gray-900">
//             Student Directory
//           </h1>
//           <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
//             {filtered.length} TOTAL
//           </span>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
//             ⚠️ {error}
//           </div>
//         )}

//         <div className="flex flex-col gap-3">
//           {loading && <p className="text-gray-400">Loading...</p>}
//           {!loading && !error && filtered.length === 0 && (
//             <p className="text-gray-400">No users found</p>
//           )}
//           {filtered.map((user) => (
//             <UserCard
//               key={user.clerkId}
//               user={user}
//               onEdit={setSelectedUser}
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="absolute bottom-24 right-5">
//         <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
//           <UserPlus className="h-6 w-6" />
//         </button>
//       </div>

//       {selectedUser && (
//         <EditUserModal
//           user={selectedUser}
//           onClose={() => setSelectedUser(null)}
//           onSuccess={fetchUsers}
//         />
//       )}
//       <Footer />
//     </div>
//   );
// };

// export default User;

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Search, UserPlus } from "lucide-react";
import UserCard from "../members/components/UserCard";
import EditUserModal from "../members/components/EditUserModal";

const BACKEND_URL = "https://tokalot.vercel.app";

interface UserType {
  id: string;
  clerkId: string;
  fullName: string;
  email?: string;
  isMember: boolean;
  image?: string;
}

const User = () => {
  const { userId } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND_URL}/api/admin/get-user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": userId ?? "",
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status}: ${errText}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data?.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message ?? "Unknown error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUsers();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": userId ?? "",
        },
        body: JSON.stringify({ id }),
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = Array.isArray(users)
    ? users.filter((u) =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#EFEFEF] rounded-2xl h-[55px] pl-11 pr-4 text-sm outline-none"
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">
            Student Directory
          </h1>
          <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
            {filtered.length} TOTAL
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {loading && <p className="text-gray-400">Loading...</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-gray-400">No users found</p>
          )}
          {filtered.map((user) => (
            <UserCard
              key={user.clerkId}
              user={user}
              onEdit={setSelectedUser}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-24 right-5">
        <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
          <UserPlus className="h-6 w-6" />
        </button>
      </div>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={fetchUsers}
        />
      )}
      <Footer />
    </div>
  );
};

export default User;
