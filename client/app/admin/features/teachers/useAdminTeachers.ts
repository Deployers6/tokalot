"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ADMIN_BACKEND_URL, asList } from "../common/api";
import type { Teacher } from "./types";

export function useAdminTeachers() {
  const { getToken } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${ADMIN_BACKEND_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.ok ? await res.json() : [];
      setTeachers(asList<Teacher>(data));
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const filteredTeachers = useMemo(() => {
    const value = query.toLowerCase();
    return teachers.filter((teacher) =>
      [teacher.fullName, teacher.bio, teacher.experience]
        .join(" ")
        .toLowerCase()
        .includes(value),
    );
  }, [query, teachers]);

  const deleteTeacher = useCallback(
    async (id: string) => {
      const token = await getToken();
      const res = await fetch(`${ADMIN_BACKEND_URL}/api/admin/teachers?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "You can only delete teachers you have added");
      }
      await fetchTeachers();
    },
    [fetchTeachers, getToken],
  );

  return {
    query,
    setQuery,
    loading,
    teachers,
    filteredTeachers,
    deleteTeacher,
  };
}
