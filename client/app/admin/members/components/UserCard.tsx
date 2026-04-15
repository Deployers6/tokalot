"use client";

import { useRouter } from "next/navigation";
import { Calendar, Pencil, UserRound, Ticket } from "lucide-react";

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
  { label: string; bg: string; text: string; dot: string }
> = {
  ACTIVE: {
    label: "ACTIVE",
    bg: "bg-green-50",
    text: "text-green-600",
    dot: "bg-green-500",
  },
  PENDING: {
    label: "PENDING",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    dot: "bg-yellow-500",
  },
  EXPIRED: {
    label: "EXPIRED",
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "bg-red-500",
  },
  NO_MEMBERSHIP: {
    label: "NO MEMBERSHIP",
    bg: "bg-gray-50",
    text: "text-gray-400",
    dot: "bg-gray-300",
  },
};

const UserCard = ({ user, onDelete }: Props) => {
  const router = useRouter();
  if (!user) return null;

  const status = user.membershipStatus ?? "NO_MEMBERSHIP";
  const badge = STATUS_BADGE[status] ?? STATUS_BADGE["NO_MEMBERSHIP"];

  return (
    <div
      onClick={() => router.push(`/admin/members/${user.clerkId}`)}
      className="group flex items-center justify-between bg-white border border-gray-100 rounded-[28px] p-4 shadow-sm active:scale-[0.98] md:hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <div className="bg-[#F1F5F9] rounded-[20px] h-[55px] w-[55px] flex items-center justify-center border-2 border-white shadow-inner">
            <UserRound className="h-6 w-6 text-gray-400" />
          </div>
          {/* Status Dot */}
          <div
            className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${badge.dot}`}
          />
        </div>

        {/* Info Section */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-black text-gray-900 truncate text-[15px] tracking-tight">
              {user.fullName}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Badge */}
            <span
              className={`text-[9px] font-black px-2.5 py-1 rounded-lg ${badge.bg} ${badge.text} border border-current/10 tracking-widest`}
            >
              {badge.label}
            </span>

            {/* Session Credit */}
            {typeof user.remainingSessions === "number" &&
              status !== "NO_MEMBERSHIP" && (
                <div className="flex items-center gap-1">
                  <Ticket
                    className={`h-3 w-3 ${user.remainingSessions === 0 ? "text-red-400" : "text-[#20BEF9]"}`}
                  />
                  <span
                    className={`text-[11px] font-bold ${user.remainingSessions === 0 ? "text-red-400" : "text-gray-500"}`}
                  >
                    {user.remainingSessions} left
                  </span>
                </div>
              )}
          </div>

          {/* Date Info */}
          {user.membershipEnd && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <Calendar className="h-3 w-3" />
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
        </div>
      </div>

      {/* Edit Arrow/Button */}
      <div className="ml-2 bg-[#F1F5F9] group-hover:bg-[#20BEF9] group-hover:text-white h-10 w-10 flex items-center justify-center rounded-2xl transition-colors">
        <Pencil className="h-4 w-4" />
      </div>
    </div>
  );
};

export default UserCard;
