"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getSessionDateInputValue, getSessionToday } from "@/app/admin/lib/session-time";
import { ADMIN_BACKEND_URL, ADMIN_SESSION_URL, asList } from "../common/api";
import type { Section, TeacherOption } from "./types";

function pickSections(value: unknown): Section[] {
  const sections = asList<Section>(value, "sections");
  if (sections.length) return sections;
  const data = asList<Section>(value, "data");
  if (data.length) return data;
  return asList<Section>(value);
}

export function useAdminSessions() {
  const { userId } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getSessionToday);

  const fetchSections = useCallback(async (options?: { reset?: boolean }) => {
    if (!userId) return;
    if (options?.reset) setSections([]);
    setLoading(true);
    try {
      const headers = { "x-admin-id": userId };
      const response = await fetch(`${ADMIN_SESSION_URL}/api/admin-section`, { headers });
      const data = await response.json();
      const list = pickSections(data);
      const detailed = await Promise.all(
        list.map(async (section) => {
          try {
            const detailResponse = await fetch(
              `${ADMIN_SESSION_URL}/api/admin-section/${section.id}`,
              { headers },
            );
            const detail = await detailResponse.json();
            const fullSection = detail.section || detail;
            return { ...section, bookings: fullSection.bookings || [] };
          } catch {
            return { ...section, bookings: [] };
          }
        }),
      );
      setSections(detailed);
    } catch {
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await fetch(`${ADMIN_BACKEND_URL}/api/admin/teachers`);
      setTeachers(asList<TeacherOption>(await response.json()));
    } catch {
      setTeachers([]);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchSections();
    fetchTeachers();
  }, [fetchSections, fetchTeachers, userId]);

  const filteredSections = useMemo(
    () =>
      sections
        .filter((section) => getSessionDateInputValue(section.StartTime) === selectedDate)
        .sort((left, right) => left.StartTime.localeCompare(right.StartTime)),
    [sections, selectedDate],
  );

  const activeDates = useMemo(
    () => new Set(sections.map((section) => getSessionDateInputValue(section.StartTime))),
    [sections],
  );

  return {
    userId,
    teachers,
    sections,
    loading,
    selectedDate,
    setSelectedDate,
    filteredSections,
    activeDates,
    refresh: fetchSections,
  };
}
