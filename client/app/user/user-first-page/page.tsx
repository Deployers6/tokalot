"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export default function UserFirstPage() {
  const { user } = useUser();
  const router = useRouter();
  const firstName = user?.firstName || "there";

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-6">
      <div className="w-full max-w-97.5 bg-white rounded-[2rem] shadow-xl px-8 py-12 flex flex-col items-center gap-6">

        {/* Icon */}
        <div className="bg-sky-500 rounded-2xl p-4">
          <Globe size={36} className="text-white" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-black">Tokalot</h1>
          <p className="mt-1 text-sm text-slate-400">
            Create your account to start speaking English
          </p>
        </div>

        {/* Welcome card */}
        <div className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-6 py-6 flex flex-col gap-4">
          <div>
            <p className="text-xl font-black text-black">
              <span className="text-sky-500">Hello</span>, {firstName}!
            </p>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Unlock the full Tokalot experience. Required for session booking
              and access to all club features.
            </p>
          </div>

          <button
            onClick={() => router.push("/user/membership-price")}
            className="w-fit rounded-xl bg-sky-400 hover:bg-sky-500 transition-colors px-6 py-2.5 text-sm font-bold text-white"
          >
            Become a member
          </button>
        </div>

      </div>
    </div>
  );
}
