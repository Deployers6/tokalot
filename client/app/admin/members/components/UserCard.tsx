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


"use client";

import { Pencil, Trash2 } from "lucide-react";

interface UserType {
  clerkId: string; // Internal API-аас ирсэн ID
  fullName: string;
  isMember: boolean;
  image?: string;
}

interface Props {
  user: UserType;
  onEdit: (user: UserType) => void;
  onDelete: (clerkId: string) => void;
}

const UserCard = ({ user, onEdit, onDelete }: Props) => {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-[60px] h-[60px] rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <img
              src={user.image}
              className="w-full h-full object-cover"
              alt={user.fullName}
            />
          ) : (
            "🧑"
          )}
        </div>

        <div>
          <p className="font-extrabold text-gray-900">{user.fullName}</p>
          <p className="text-sm text-gray-400">
            {user.isMember ? "Member ✅" : "Not Member ❌"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(user)}
          className="bg-[#DAF2F9] h-[36px] w-[36px] flex items-center justify-center rounded-xl"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>

        <button
          onClick={() => onDelete(user.clerkId)}
          className="bg-red-100 h-[36px] w-[36px] flex items-center justify-center rounded-xl"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default UserCard;