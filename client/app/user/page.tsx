"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function UserPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const firstName = isLoaded ? (user?.firstName ?? user?.username ?? "there") : "...";

  return (
    <div className="flex min-h-screen items-center justify-center md:bg-neutral-200 md:py-10">
      <div className="relative flex w-full flex-col bg-white min-h-screen md:min-h-0 md:w-[390px] md:h-[860px] md:rounded-[2rem] md:shadow-2xl md:overflow-hidden">

        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10">

          {/* Branding */}
          <div className="flex flex-col items-center text-center gap-1">
            <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center shadow-md">
              <Globe size={24} className="text-white" />
            </div>
            <h1 className="mt-2 text-2xl font-black text-black">Tokalot</h1>
            <p className="text-xs text-slate-400">
              Create your account to start speaking English
            </p>
          </div>

          {/* Welcome card */}
          <div className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-6 py-8 flex flex-col items-center gap-4 text-center">
            <div>
              <p className="text-2xl font-black text-black">
                <span className="text-sky-500">Hello</span>, {firstName}!
              </p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Unlock the full Tokalot experience. Required for session booking and access to all club features.
              </p>
            </div>
            <button
              onClick={() => router.push("/user/become-a-member")}
              className="w-fit rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-600 transition-colors"
            >
              Become a member
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
