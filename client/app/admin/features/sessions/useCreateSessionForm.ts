"use client";

import { useState } from "react";
import { getSessionToday } from "@/app/admin/lib/session-time";
import type { SessionEditorValues } from "./types";

const defaultForm: SessionEditorValues = {
  title: "",
  sessionDate: getSessionToday(),
  startTime: "",
  endTime: "",
  capacity: "15",
  teacherId: "",
};

export function useCreateSessionForm(defaultDate?: string) {
  const [form, setForm] = useState<SessionEditorValues>({
    ...defaultForm,
    sessionDate: defaultDate || defaultForm.sessionDate,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (name: keyof SessionEditorValues, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  return { form, loading, error, setLoading, setError, updateField };
}
