"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_BACKEND_URL, asList } from "../common/api";
import type { TeacherFormValues, TeacherRecord } from "./types";

const emptyTeacher: TeacherFormValues = {
  fullName: "",
  experience: "",
  bio: "",
  imageUrl: "/default-profile.png",
};

interface UseTeacherEditorOptions {
  teacherId?: string;
  mode: "create" | "edit";
}

export function useTeacherEditor({ teacherId, mode }: UseTeacherEditorOptions) {
  const router = useRouter();
  const { getToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<TeacherFormValues>(emptyTeacher);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const loadTeacher = useCallback(async () => {
    if (!teacherId) return;
    try {
      const token = await getToken();
      const res = await fetch(`${ADMIN_BACKEND_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const teachers = asList<TeacherRecord>(await res.json());
      const teacher = teachers.find((item) => item.id === teacherId);
      if (!teacher) return router.push("/admin/teachers");
      setForm(teacher);
    } catch {
      router.push("/admin/teachers");
    } finally {
      setLoading(false);
    }
  }, [getToken, router, teacherId]);

  useEffect(() => {
    if (mode === "edit") loadTeacher();
  }, [loadTeacher, mode]);

  const updateField = useCallback(
    (name: keyof TeacherFormValues, value: string) => {
      setForm((current) => ({ ...current, [name]: value }));
    },
    [],
  );

  const updateImage = useCallback((file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    const reader = new FileReader();
    reader.onloadend = () => updateField("imageUrl", String(reader.result || ""));
    reader.readAsDataURL(file);
  }, [updateField]);

  return {
    form,
    preview,
    loading,
    saving,
    setSaving,
    fileInputRef,
    setPreview,
    updateField,
    updateImage,
    router,
    getToken,
  };
}
