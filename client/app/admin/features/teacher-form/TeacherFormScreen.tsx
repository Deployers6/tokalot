"use client";

import { AdminShell } from "../../components/layout/AdminShell";
import { ADMIN_BACKEND_URL } from "../common/api";
import { TeacherAvatarField } from "./TeacherAvatarField";
import { TeacherBioField } from "./TeacherBioField";
import { TeacherFormActions } from "./TeacherFormActions";
import { TeacherTextField } from "./TeacherTextField";
import { useTeacherEditor } from "./useTeacherEditor";

interface TeacherFormScreenProps {
  mode: "create" | "edit";
  teacherId?: string;
}

export function TeacherFormScreen({ mode, teacherId }: TeacherFormScreenProps) {
  const editor = useTeacherEditor({ mode, teacherId });
  const title = mode === "create" ? "Add New Teacher" : "Edit Teacher";

  const submit = async () => {
    const { fullName, experience, bio, imageUrl } = editor.form;
    if (!fullName || !experience) return alert("Name and experience are required");
    editor.setSaving(true);
    try {
      const token = await editor.getToken();
      const url =
        mode === "edit" && teacherId
          ? `${ADMIN_BACKEND_URL}/api/admin/teachers?id=${teacherId}`
          : `${ADMIN_BACKEND_URL}/api/admin/teachers`;
      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ fullName, bio, experience, imageUrl }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Failed to save");
      editor.router.push("/admin/teachers");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save");
    } finally {
      editor.setSaving(false);
    }
  };

  const remove = async () => {
    if (!teacherId || !confirm("Are you sure you want to delete this profile?")) return;
    try {
      const token = await editor.getToken();
      const response = await fetch(`${ADMIN_BACKEND_URL}/api/admin/teachers?id=${teacherId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "You can only delete teachers you have added");
      }
      editor.router.push("/admin/teachers");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  if (editor.loading) {
    return (
      <AdminShell backHref="/admin/teachers" backLabel="Teachers" mobileTitle={title}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#20BEF9] border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      backHref="/admin/teachers"
      backLabel="Teachers"
      mobileTitle={title}
      eyebrow="Teacher Profile"
      title={title}
    >
      <div className="px-5 py-8 lg:mx-auto lg:w-full lg:max-w-3xl lg:px-8">
        <div className="space-y-8 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm lg:p-8">
          <TeacherAvatarField
            imageUrl={editor.form.imageUrl}
            preview={editor.preview}
            fileInputRef={editor.fileInputRef}
            onFileChange={editor.updateImage}
            label={mode === "create" ? "Upload Photo" : "Update Photo"}
          />
          <TeacherTextField
            label="Full Name"
            name="fullName"
            value={editor.form.fullName}
            placeholder="e.g. John Doe"
            onChange={editor.updateField}
          />
          <TeacherTextField
            label="Experience Level"
            name="experience"
            value={editor.form.experience}
            placeholder="e.g. 5 Years, Senior Expert"
            onChange={editor.updateField}
          />
          <TeacherBioField
            value={editor.form.bio}
            onChange={(value) => editor.updateField("bio", value)}
          />
          <TeacherFormActions
            saving={editor.saving}
            onSave={submit}
            onDelete={mode === "edit" ? remove : undefined}
          />
        </div>
      </div>
    </AdminShell>
  );
}
