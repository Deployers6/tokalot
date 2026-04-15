"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ADMIN_BACKEND_URL, asList } from "../common/api";
import { normalizeStatus, parseDate, toLocalDateString } from "./date-utils";
import type { MembershipData, MembershipStatus, UserDetail } from "./types";

export function useAdminMemberDetail() {
  const params = useParams();
  const router = useRouter();
  const { userId } = useAuth();
  const clerkId = String(params?.clerkId || "");
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>("PENDING");
  const [sessionUsed, setSessionUsed] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [membershipStart, setMembershipStart] = useState<Date | null>(null);
  const [membershipEnd, setMembershipEnd] = useState<Date | null>(null);
  const [membershipDeleted, setMembershipDeleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!userId || !clerkId) return;
    try {
      setLoading(true);
      const usersResponse = await fetch(`${ADMIN_BACKEND_URL}/api/admin/get-user`, { headers: { "x-admin-id": userId } });
      const users = asList<UserDetail>(await usersResponse.json(), "users");
      const user = users.find((item) => item.clerkId === clerkId);
      if (!user) return router.push("/admin/members");
      setFullName(user.fullName || "");
      const membershipResponse = await fetch(`${ADMIN_BACKEND_URL}/api/admin/membership`, { headers: { "x-user-id": clerkId, "x-admin-id": userId } });
      const membershipData = membershipResponse.ok ? ((await membershipResponse.json()) as MembershipData) : null;
      setMembership(membershipData);
      setMembershipStatus(normalizeStatus(membershipData?.status));
      setSessionUsed(membershipData?.usedSessions || 0);
      setSessionTotal(membershipData?.totalSessions || 0);
      setMembershipStart(parseDate(membershipData?.startDate));
      setMembershipEnd(parseDate(membershipData?.endDate));
    } finally {
      setLoading(false);
    }
  }, [clerkId, router, userId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    clerkId,
    loading,
    fullName,
    setFullName,
    membership,
    membershipStatus,
    setMembershipStatus,
    sessionUsed,
    sessionTotal,
    setSessionCredits: (used: number, total: number) => {
      setSessionUsed(used);
      setSessionTotal(total);
    },
    membershipStart,
    membershipEnd,
    setMembershipRange: (start: Date | null, end: Date | null) => {
      setMembershipStart(start);
      setMembershipEnd(end);
    },
    saving,
    save: async () => {
      setSaving(true);
      try {
        const parts = fullName.trim().split(" ");
        await fetch(`${ADMIN_BACKEND_URL}/api/admin/patch-user`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetClerkId: clerkId, adminClerkId: userId, firstName: parts[0] || "", lastName: parts.slice(1).join(" ") }) });
        if (!membershipDeleted) {
          await fetch(`${ADMIN_BACKEND_URL}/api/admin/membership`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-user-id": clerkId }, body: JSON.stringify({ clerkId, startDate: toLocalDateString(membershipStart), endDate: toLocalDateString(membershipEnd), totalSessions: sessionTotal, usedSessions: sessionUsed, status: membershipStatus }) });
        }
        router.back();
      } finally {
        setSaving(false);
      }
    },
    deleteMembership: async () => {
      await fetch(`${ADMIN_BACKEND_URL}/api/admin/membership`, { method: "DELETE", headers: { "Content-Type": "application/json", "x-user-id": clerkId }, body: JSON.stringify({ clerkId }) });
      setMembership(null);
      setMembershipStatus("PENDING");
      setSessionUsed(0);
      setSessionTotal(0);
      setMembershipStart(null);
      setMembershipEnd(null);
      setMembershipDeleted(true);
    },
    deleteUser: async () => {
      await fetch(`${ADMIN_BACKEND_URL}/api/admin/delete-user`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetClerkId: clerkId, adminClerkId: userId }) });
      router.back();
    },
  };
}
