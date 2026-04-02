"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { getSessions, type Session } from "@/lib/sessions";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function RequestPendingPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Your request is pending</h1>
        <p className="text-gray-600 mb-6">
          We are reviewing your request. You will receive an email once it's
          approved.
        </p>
        <button
          onClick={() => router.push("/user/dashboard")}
          className={cn(
            "px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600",
          )}
        >
          Back to Dashboard
        </button>{" "}
      </div>{" "}
    </div>
  );
}
