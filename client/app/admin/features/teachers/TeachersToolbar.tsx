import Link from "next/link";
import { Search, UserPlus } from "lucide-react";

interface TeachersToolbarProps {
  count: number;
  query: string;
  onQueryChange: (value: string) => void;
}

export function TeachersToolbar({
  count,
  query,
  onQueryChange,
}: TeachersToolbarProps) {
  return (
    <section className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
            Faculty Directory
          </p>
          <h2 className="text-3xl font-black text-slate-950">Teachers</h2>
        </div>
        <Link
          href="/admin/add-new-teacher"
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-black px-6 text-sm font-black uppercase tracking-[0.2em] text-white"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Add Teacher
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="rounded-[28px] border border-slate-100 bg-[#efefef] p-6">
          <p className="text-4xl font-black text-slate-900">{count}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
            Total Teachers
          </p>
        </div>
        <label className="relative flex h-16 items-center rounded-[28px] border border-transparent bg-[#efefef] px-5 focus-within:border-[#20BEF9]">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, bio, or experience..."
            className="ml-4 w-full bg-transparent text-sm font-bold outline-none"
          />
        </label>
      </div>
    </section>
  );
}
