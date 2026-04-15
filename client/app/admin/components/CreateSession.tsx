"use client";

import { useEffect, useState } from "react";
import { ADMIN_BACKEND_URL, asList } from "../features/common/api";
import { CreateSessionForm } from "../features/sessions/CreateSessionForm";
import type { TeacherOption } from "../features/sessions/types";

export default function CreateSession({
  onClose,
  onSuccess,
  defaultDate,
  teachers,
}: {
  onClose?: () => void;
  onSuccess?: () => void;
  defaultDate?: string;
  teachers?: TeacherOption[];
}) {
  const [fetchedTeachers, setFetchedTeachers] = useState<TeacherOption[]>([]);
  const teacherOptions = teachers?.length ? teachers : fetchedTeachers;

  useEffect(() => {
    if (teachers?.length) return;

    let cancelled = false;

    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${ADMIN_BACKEND_URL}/api/admin/teachers`);
        const data = await response.json();

        if (!cancelled) {
          setFetchedTeachers(asList<TeacherOption>(data));
        }
      } catch {
        if (!cancelled) {
          setFetchedTeachers([]);
        }
      }
    };

    void fetchTeachers();

    return () => {
      cancelled = true;
    };
  }, [teachers]);

  return (
    <CreateSessionForm
      key={defaultDate || "create-session"}
      teachers={teacherOptions}
      defaultDate={defaultDate}
      onClose={onClose || (() => undefined)}
      onSuccess={onSuccess || (() => undefined)}
    />
  );
}
