"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendMembershipRequest } from "@/lib/api";

export function useMembershipRequest() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  return {
    loading,
    send: async () => {
      if (!user) return;
      setLoading(true);
      try {
        await sendMembershipRequest(user.id, user.primaryEmailAddress?.emailAddress ?? "", user.fullName ?? user.firstName ?? "");
        router.push("/user/become-a-member/pending");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to send request";
        if (message.includes("аль хэдийн")) return router.push("/user/become-a-member/pending");
        alert(message);
      } finally {
        setLoading(false);
      }
    },
  };
}
