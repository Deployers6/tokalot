import TeacherEditScreen from "@/app/admin/features/teacher-form/TeacherEditScreen";

export default async function EditTeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TeacherEditScreen teacherId={id} />;
}
