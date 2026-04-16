import UserCard from "../../members/components/UserCard";
import type { AdminMember } from "./types";

interface MembersListProps {
  users: AdminMember[];
  loading: boolean;
  error: string | null;
}

export function MembersList({
  users,
  loading,
  error,
}: MembersListProps) {
  return (
    <div className="space-y-4 px-5 pb-8 lg:px-8">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-600">
          {error}
        </div>
      ) : null}
      {loading ? (
        <div className="flex py-20">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#20BEF9] border-t-transparent" />
        </div>
      ) : null}
      {!loading && !users.length ? (
        <div className="py-20 text-center text-xs font-black uppercase tracking-[0.24em] text-slate-300">
          No users found
        </div>
      ) : null}
      {users.map((user) => <UserCard key={user.clerkId} user={user} />)}
    </div>
  );
}
