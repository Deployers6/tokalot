"use client";

import { CalendarIcon, Loader2, X } from "lucide-react";
import {
  isSessionTimeRangeInvalid,
  toSessionISOString,
} from "@/app/admin/lib/session-time";
import { ADMIN_SESSION_URL } from "../common/api";
import { SessionFormFields } from "./SessionFormFields";
import { useCreateSessionForm } from "./useCreateSessionForm";
import type { TeacherOption } from "./types";

interface CreateSessionFormProps {
  teachers: TeacherOption[];
  defaultDate?: string;
  onClose: () => void;
  onSuccess: (publishedDate: string) => void;
}

export function CreateSessionForm({
  teachers,
  defaultDate,
  onClose,
  onSuccess,
}: CreateSessionFormProps) {
  const form = useCreateSessionForm(defaultDate);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !form.form.title ||
      !form.form.teacherId ||
      !form.form.startTime ||
      !form.form.endTime
    ) {
      return form.setError("Please fill in all fields.");
    }
    if (isSessionTimeRangeInvalid(form.form.startTime, form.form.endTime)) {
      return form.setError("End time must be after start time.");
    }
    form.setLoading(true);
    form.setError("");
    try {
      const payload = {
        title: form.form.title,
        level: "Beginner",
        teacherId: form.form.teacherId,
        StartTime: toSessionISOString(
          form.form.sessionDate,
          form.form.startTime,
        ),
        endTime: toSessionISOString(form.form.sessionDate, form.form.endTime),
        capacity: form.form.capacity,
      };
      const response = await fetch(`${ADMIN_SESSION_URL}/api/admin-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to create session");
      onSuccess(form.form.sessionDate);
    } catch (error) {
      form.setError(
        error instanceof Error ? error.message : "Failed to create session",
      );
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Header title="Create New Session" onClose={onClose} />
      {form.error ? <ErrorMessage message={form.error} /> : null}
      <SessionFormFields
        form={form.form}
        teachers={teachers}
        onChange={form.updateField}
      />
      <SubmitButton loading={form.loading} label="Publish Session" />
    </form>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#c2e8ff] p-2">
          <CalendarIcon className="h-5 w-5 text-[#006688]" />
        </div>
        <h2 className="text-lg font-black">{title}</h2>
      </div>
      <button type="button" onClick={onClose} className="text-slate-400">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-red-100 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#20BEF9] py-4 text-sm font-black uppercase tracking-[0.2em] text-white disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {loading ? "Creating..." : label}
    </button>
  );
}
