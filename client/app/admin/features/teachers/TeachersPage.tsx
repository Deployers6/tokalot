"use client";

import { AdminShell } from "../../components/layout/AdminShell";
import { TeacherList } from "./TeacherList";
import { TeachersToolbar } from "./TeachersToolbar";
import { useAdminTeachers } from "./useAdminTeachers";

export default function TeachersPage() {
  const { teachers, filteredTeachers, query, setQuery, loading, deleteTeacher } =
    useAdminTeachers();

  return (
    <AdminShell eyebrow="Faculty Directory" title="Teachers">
      <TeachersToolbar
        count={teachers.length}
        query={query}
        onQueryChange={setQuery}
      />
      <TeacherList
        teachers={filteredTeachers}
        loading={loading}
        onDelete={async (id) => {
          if (!confirm("Are you sure you want to delete this teacher?")) return;
          try {
            await deleteTeacher(id);
          } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to delete teacher");
          }
        }}
      />
    </AdminShell>
  );
}
