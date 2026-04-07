// "use client";

// import { Pencil, Trash2 } from "lucide-react";

// interface UserType {
//   id: string;
//   fullName: string;
//   isMember: boolean;
//   image?: string;
// }

// interface Props {
//   user: UserType;
//   onEdit: (user: UserType) => void;
//   onDelete: (id: string) => void;
// }

// const UserCard = ({ user, onEdit, onDelete }: Props) => {
//   return (
//     <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
//           {user.image ? (
//             <img
//               src={user.image}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             "🧑"
//           )}
//         </div>

//         <div>
//           <p className="font-extrabold text-gray-900">
//             {user.fullName}
//           </p>

//           <p className="text-sm text-gray-400">
//             {user.isMember ? "Member ✅" : "Not Member ❌"}
//           </p>
//         </div>
//       </div>

//       <div className="flex gap-2">
//         {/* EDIT */}
//         <button
//           onClick={() => onEdit(user)}
//           className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//         >
//           <Pencil className="h-4 w-4 text-gray-600" />
//         </button>

//         {/* DELETE */}
//         <button
//           onClick={() => onDelete(user.id)}
//           className="bg-red-100 h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//         >
//           <Trash2 className="h-4 w-4 text-red-500" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserCard;

// "use client";

// import { Pencil, Trash2 } from "lucide-react";

// // interface UserType {
// //   clerkId: string; // Internal API-аас ирсэн ID
// //   fullName: string;
// //   isMember: boolean;
// //   image?: string;
// // }

// // interface Props {
// //   user: UserType;
// //   onEdit: (user: UserType) => void;
// //   onDelete: (clerkId: string) => void;
// // }

// // UserCard.tsx
// // interface UserType {
// //   id: string;        // ← энийг нэм
// //   clerkId: string;
// //   fullName: string;
// //   isMember: boolean;
// //   image?: string;
// // }

// interface UserType {
//   id: string;
//   clerkId: string;
//   fullName: string;
//   email?: string; // ← нэм
//   isMember: boolean;
//   image?: string;
// }

// interface Props {
//   user: UserType;
//   onEdit: (user: UserType) => void; // ← UserType нь id-тэй болсон учраас match болно
//   onDelete: (clerkId: string) => void;
// }

// const UserCard = ({ user, onEdit, onDelete }: Props) => {
//   return (
//     <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
//           {user.image ? (
//             <img
//               src={user.image}
//               className="w-full h-full object-cover"
//               alt={user.fullName}
//             />
//           ) : (
//             "🧑"
//           )}
//         </div>

//         <div>
//           <p className="font-extrabold text-gray-900">{user.fullName}</p>
//           <p className="text-sm text-gray-400">
//             {user.isMember ? "Member ✅" : "Not Member ❌"}
//           </p>
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={() => onEdit(user)}
//           className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//         >
//           <Pencil className="h-4 w-4 text-gray-600" />
//         </button>

//         <button
//           onClick={() => onDelete(user.clerkId)}
//           className="bg-red-100 h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//         >
//           <Trash2 className="h-4 w-4 text-red-500" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserCard;

// "use client";

// import { Pencil, Trash2 } from "lucide-react";

// interface UserType {
//   id: string;
//   clerkId: string;
//   fullName: string;
//   email?: string;
//   isMember: boolean;
//   image?: string;
// }

// interface Props {
//   user: UserType;
//   onEdit: (user: UserType) => void;
//   onDelete: (id: string) => void;
// }

// const UserCard = ({ user, onEdit, onDelete }: Props) => {
//   return (
//     <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
//           {user.image ? (
//             <img
//               src={user.image}
//               className="w-full h-full object-cover"
//               alt={user.fullName}
//             />
//           ) : (
//             "🧑"
//           )}
//         </div>

//         <div>
//           <p className="font-extrabold text-gray-900">{user.fullName}</p>
//           <p className="text-sm text-gray-400">
//             {user.isMember ? "Member ✅" : "Not Member ❌"}
//           </p>
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={() => onEdit(user)}
//           className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//         >
//           <Pencil className="h-4 w-4 text-gray-600" />
//         </button>

//         <button
//           onClick={() => onDelete(user.id)}
//           className="bg-red-100 h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//         >
//           <Trash2 className="h-4 w-4 text-red-500" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserCard;

// "use client";

// import { Pencil, Trash2 } from "lucide-react";

// interface UserType {
//   id: string;
//   clerkId: string;
//   fullName: string;
//   email?: string;
//   isMember: boolean;
//   membershipStatus?: string;
//   image?: string;
// }

// interface Props {
//   user: UserType;
//   onEdit: (user: UserType) => void;
//   onDelete: (id: string) => void;
// }

// const UserCard = ({ user, onEdit, onDelete }: Props) => {
//   if (!user) return null;

//   return (
//     <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
//       <div className="flex items-center gap-3">
//         <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
//           {user?.image ? (
//             <img
//               src={user.image}
//               className="w-full h-full object-cover"
//               alt={user.fullName}
//             />
//           ) : (
//             "🧑"
//           )}
//         </div>

//         <div>
//           <p className="font-extrabold text-gray-900">{user?.fullName}</p>
//           <p className="text-sm text-gray-400">
//             {user?.isMember ? "Member ✅" : "Not Member ❌"}
//           </p>
//           <p className="text-xs text-orange-400">{user?.membershipStatus}</p>
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={() => onEdit(user)}
//           className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//         >
//           <Pencil className="h-4 w-4 text-gray-600" />
//         </button>

//         <button
//           onClick={() => onDelete(user.clerkId)}
//           className="bg-red-100 h-[36px] w-[36px] flex items-center justify-center rounded-xl"
//         >
//           <Trash2 className="h-4 w-4 text-red-500" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserCard;

// "use client";

// import { useRouter } from "next/navigation";
// import { Calendar, Pencil } from "lucide-react";

// interface UserType {
//   id: string;
//   clerkId: string;
//   fullName: string;
//   email?: string;
//   isMember: boolean;
//   membershipStatus?: string;
//   image?: string;
//   enrolledAt?: string;
//   createdAt?: string;
// }

// interface Props {
//   user: UserType;
//   onEdit: (user: UserType) => void;
//   onDelete: (id: string) => void;
// }

// const UserCard = ({ user, onEdit, onDelete }: Props) => {
//   const router = useRouter();
//   if (!user) return null;

//   const dateStr = user.enrolledAt || user.createdAt;

//   return (
//     <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
//       <div className="flex items-center gap-3 flex-1 min-w-0">
//         <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
//           {user.image ? (
//             <img
//               src={user.image}
//               className="w-full h-full object-cover"
//               alt={user.fullName}
//             />
//           ) : (
//             <span className="text-2xl">🧑</span>
//           )}
//         </div>
//         <div className="min-w-0">
//           <p className="font-extrabold text-gray-900 truncate">
//             {user.fullName}
//           </p>
//           <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
//             <Calendar className="h-3 w-3 flex-shrink-0" />
//             <span>
//               Enrolled:{" "}
//               {dateStr
//                 ? new Date(dateStr).toLocaleDateString("en-US", {
//                     month: "short",
//                     day: "2-digit",
//                     year: "numeric",
//                   })
//                 : "—"}
//             </span>
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={() => router.push(`/admin/members/${user.clerkId}`)}
//         className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl flex-shrink-0 ml-2"
//       >
//         <Pencil className="h-4 w-4 text-gray-600" />
//       </button>
//     </div>
//   );
// };

// export default UserCard;

"use client";

import { useRouter } from "next/navigation";
import { Calendar, Pencil, UserRound } from "lucide-react";

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

interface Props {
  user: UserType;
  onDelete: (id: string) => void;
}

const STATUS_BADGE: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  ACTIVE: { label: "Active", bg: "bg-green-50", text: "text-green-600" },
  PENDING: { label: "Pending", bg: "bg-yellow-50", text: "text-yellow-600" },
  EXPIRED: { label: "Expired", bg: "bg-red-50", text: "text-red-500" },
  NO_MEMBERSHIP: {
    label: "No membership",
    bg: "bg-gray-100",
    text: "text-gray-400",
  },
};

const UserCard = ({ user, onDelete }: Props) => {
  const router = useRouter();
  if (!user) return null;

  const status = user.membershipStatus ?? "NO_MEMBERSHIP";
  const badge = STATUS_BADGE[status] ?? STATUS_BADGE["NO_MEMBERSHIP"];

  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Avatar */}
        {/* <div className="w-[56px] h-[56px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.image ? (
            <img src={user.image} className="w-full h-full object-cover" alt={user.fullName} />
          ) : (
            <span className="text-2xl">🧑</span>
          )}
        </div> */}
        <div className="relative">
          <div className="bg-gray-300 rounded-full h-[50px] w-[50px] flex items-center justify-center">
            <UserRound className="h-[20px] w-[20px]" />
          </div>
        </div>
        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-extrabold text-gray-900 truncate">
              {user.fullName}
            </p>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}
            >
              {badge.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            {user.membershipEnd && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>
                  Until{" "}
                  {new Date(user.membershipEnd).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
            {typeof user.remainingSessions === "number" &&
              status !== "NO_MEMBERSHIP" && (
                <span
                  className={`text-xs font-semibold ${user.remainingSessions === 0 ? "text-red-400" : "text-gray-400"}`}
                >
                  🎫 {user.remainingSessions} left
                </span>
              )}
          </div>
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={() => router.push(`/admin/members/${user.clerkId}`)}
        className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl flex-shrink-0 ml-2"
      >
        <Pencil className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
};

export default UserCard;
