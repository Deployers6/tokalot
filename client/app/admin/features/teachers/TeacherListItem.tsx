import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import type { Teacher } from "./types";

interface TeacherListItemProps {
  teacher: Teacher;
  onDelete: (id: string) => void;
}

export function TeacherListItem({ teacher, onDelete }: TeacherListItemProps) {
  return (
    <article className="flex items-center justify-between rounded-[28px] border border-slate-50 bg-white p-5 shadow-sm">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={teacher.imageUrl || "/default-profile.png"}
            alt={teacher.fullName}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-black text-slate-800">{teacher.fullName}</h3>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#20BEF9]">
            {teacher.experience}
          </p>
          <p className="mt-1 truncate text-[11px] font-medium text-slate-400">{teacher.bio}</p>
        </div>
      </div>

      <div className="ml-3 flex gap-2">
        <Link
          href={`/admin/edit-teacher-profile/${teacher.id}`}
          className="rounded-2xl bg-[#daf2f9] p-3 text-[#006688]"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          onClick={() => onDelete(teacher.id)}
          className="rounded-2xl bg-red-50 p-3 text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
