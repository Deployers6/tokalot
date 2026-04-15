"use client";

import { TeacherFormScreen } from "./TeacherFormScreen";

export default function TeacherEditScreen({ teacherId }: { teacherId: string }) {
  return <TeacherFormScreen mode="edit" teacherId={teacherId} />;
}
