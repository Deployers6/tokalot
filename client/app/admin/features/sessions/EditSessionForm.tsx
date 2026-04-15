"use client";

import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  getSessionDateInputValue,
  getSessionTimeInputValue,
  isSessionTimeRangeInvalid,
  toSessionISOString,
} from "@/app/admin/lib/session-time";
import { ADMIN_SESSION_URL } from "../common/api";
import { DeleteSessionDialog } from "./DeleteSessionDialog";
import { SessionFormFields } from "./SessionFormFields";
import type { Section, SessionEditorValues, TeacherOption } from "./types";

interface EditSessionFormProps {
  section: Section;
  teachers: TeacherOption[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EditSessionForm({ section, teachers, onClose, onSuccess }: EditSessionFormProps) {
  const [form, setForm] = useState<SessionEditorValues>({
    title: section.title,
    sessionDate: getSessionDateInputValue(section.StartTime),
    startTime: getSessionTimeInputValue(section.StartTime),
    endTime: getSessionTimeInputValue(section.endTime),
    capacity: String(section.capacity),
    teacherId: section.teacherId,
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (confirmDelete) {
    return (
      <DeleteSessionDialog
        deleting={deleting}
        error={error}
        title={section.title}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          setDeleting(true);
          try {
            const response = await fetch(`${ADMIN_SESSION_URL}/api/admin/delete.session/${section.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            onSuccess();
          } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Delete failed");
            setDeleting(false);
          }
        }}
      />
    );
  }

  return (
    <form onSubmit={async (event) => {
      event.preventDefault();
      if (isSessionTimeRangeInvalid(form.startTime, form.endTime)) {
        setError("End time must be after start time");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${ADMIN_SESSION_URL}/api/admin/patch.session/${section.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: form.title, teacherId: form.teacherId, StartTime: toSessionISOString(form.sessionDate, form.startTime), endTime: toSessionISOString(form.sessionDate, form.endTime), capacity: form.capacity }),
        });
        if (!response.ok) throw new Error("Update failed");
        onSuccess();
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "Update failed");
      } finally {
        setLoading(false);
      }
    }} className="space-y-4">
      <div className="flex items-center gap-3"><button type="button" onClick={onClose} className="text-[#20BEF9]"><ArrowLeft className="h-5 w-5" /></button><h2 className="text-lg font-black">Edit Session</h2></div>
      <SessionFormFields form={form} teachers={teachers} onChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))} />
      {error ? <p className="text-xs font-bold text-red-500">{error}</p> : null}
      <button type="submit" disabled={loading} className="flex w-full justify-center rounded-xl bg-[#20BEF9] py-4 font-black uppercase tracking-[0.2em] text-white">{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}</button>
      <button type="button" onClick={() => setConfirmDelete(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-4 font-black text-red-500"><Trash2 className="h-4 w-4" />Delete Session</button>
    </form>
  );
}
