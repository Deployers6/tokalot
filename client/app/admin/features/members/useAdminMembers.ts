"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ADMIN_BACKEND_URL, asList } from "../common/api";
import type { AdminMember } from "./types";

function toMember(record: Record<string, unknown>): AdminMember {
  return {
    clerkId: String(record.clerkId ?? ""),
    fullName: String(record.fullName ?? ""),
    email: typeof record.email === "string" ? record.email : undefined,
    image: typeof record.image === "string" ? record.image : undefined,
    isMember: record.membershipStatus === "ACTIVE",
    membershipStatus:
      typeof record.membershipStatus === "string" ? record.membershipStatus : undefined,
    membershipEnd:
      typeof record.membershipEnd === "string" ? record.membershipEnd : undefined,
    remainingSessions:
      typeof record.remainingSessions === "number" ? record.remainingSessions : undefined,
    isExpired: Boolean(record.isExpired),
    createdAt: typeof record.createdAt === "string" ? record.createdAt : undefined,
  };
}

export function useAdminMembers() {
  const { userId } = useAuth();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${ADMIN_BACKEND_URL}/api/admin/get-user`, {
        headers: { "Content-Type": "application/json", "x-admin-id": userId },
      });
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      const data = await res.json();
      setUsers(asList<Record<string, unknown>>(data, "users").map(toMember));
    } catch (err) {
      setUsers([]);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase();
    return users.filter((user) => user.fullName.toLowerCase().includes(value));
  }, [search, users]);

  return { search, setSearch, users, filteredUsers, loading, error };
}
