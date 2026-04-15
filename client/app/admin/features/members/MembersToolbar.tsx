import { Search } from "lucide-react";
import { MemberCountCard } from "./MemberCountCard";

interface MembersToolbarProps {
  count: number;
  search: string;
  onSearchChange: (value: string) => void;
}

export function MembersToolbar({
  count,
  search,
  onSearchChange,
}: MembersToolbarProps) {
  return (
    <section className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
            Management
          </p>
          <h2 className="text-3xl font-black text-slate-950">Students</h2>
        </div>
        <MemberCountCard count={count} />
      </div>

      <label className="relative flex h-[60px] items-center rounded-2xl border border-transparent bg-[#efefef] px-5 focus-within:border-[#20BEF9]">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search students..."
          className="ml-4 w-full bg-transparent text-sm font-bold outline-none"
        />
      </label>
    </section>
  );
}
