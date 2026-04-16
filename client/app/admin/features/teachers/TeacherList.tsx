import { TeacherListItem } from "./TeacherListItem";
import type { Teacher } from "./types";

interface TeacherListProps {
  teachers: Teacher[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function TeacherList({ teachers, loading, onDelete }: TeacherListProps) {
  if (loading) {
    return (
      <div className="flex py-20">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#20BEF9] border-t-transparent" />
      </div>
    );
  }

  if (!teachers.length) {
    return (
      <div className="py-20 text-center text-xs font-black uppercase tracking-[0.24em] text-slate-300">
        No teachers found
      </div>
    );
  }

  return (
    <div className="space-y-4 px-5 pb-8 lg:px-8">
      {teachers.map((teacher) => (
        <TeacherListItem key={teacher.id} teacher={teacher} onDelete={onDelete} />
      ))}
    </div>
  );
}
