

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
//   membershipStatus?: string;
//   image?: string;
// }

// const normalize = (u: any): UserType => ({
//   ...u,
//   isMember:
//     u.isMember === true ||
//     u.membershipStatus === "ACTIVE" ||
//     u.membershipStatus === "active",
// });

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
//         setUsers(data.map(normalize));
//       } else if (Array.isArray(data?.users)) {
//         setUsers(data.users.map(normalize));
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

//   const handleDelete = async (clerkId: string) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           targetClerkId: clerkId,
//           adminClerkId: userId,
//         }),
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
//               onDelete={() => handleDelete(user.clerkId)}
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

const BACKEND_URL = "https://tokalot.vercel.app";

interface UserType {
  clerkId: string;
  fullName: string;
  email?: string;
  image?: string;
  isMember: boolean;
  membershipStatus?: string;
  membershipEnd?: string;
  remainingSessions?: number;
  isExpired?: boolean;
  createdAt?: string;
}

const User = () => {
  const { userId } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND_URL}/api/admin/get-user`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "x-admin-id": userId ?? "" },
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.users ?? []);
      setUsers(list.map((u: any) => ({ ...u, isMember: u.membershipStatus === "ACTIVE" })));
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (userId) fetchUsers(); }, [userId]);

  const handleDelete = async (clerkId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${BACKEND_URL}/api/admin/delete-user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetClerkId: clerkId, adminClerkId: userId }),
      });
      fetchUsers();
    } catch (err) { console.error(err); }
  };

  const filtered = users.filter(u => u.fullName?.toLowerCase().includes(search.toLowerCase()));

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
          <h1 className="text-2xl font-extrabold text-gray-900">Student Directory</h1>
          <span className="text-[#20BEF9] font-extrabold text-sm border border-[#20BEF9] rounded-lg px-3 py-1">
            {filtered.length} TOTAL
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">⚠️ {error}</div>
        )}

        <div className="flex flex-col gap-3">
          {loading && <p className="text-gray-400">Loading...</p>}
          {!loading && !error && filtered.length === 0 && <p className="text-gray-400">No users found</p>}
          {filtered.map(user => (
            <UserCard key={user.clerkId} user={user} onDelete={() => handleDelete(user.clerkId)} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-24 right-5">
        <button className="bg-gray-900 text-white h-[64px] w-[64px] rounded-2xl flex items-center justify-center shadow-lg">
          <UserPlus className="h-6 w-6" />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default User;