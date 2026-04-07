"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList, Clock, Info } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function MembershipPendingPage() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/membership/status", {
          headers: { "x-user-id": user.id },
        });
        const data = await res.json();
        if (data?.status === "ACTIVE") {
          clearInterval(interval);
          router.push("/user/dashboard");
        }
      } catch {
        // network error, дараа дахин шалгана
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center md:bg-neutral-200 md:py-10">
      <div className="relative flex w-full flex-col bg-white min-h-screen md:min-h-0 md:w-[390px] md:h-[860px] md:rounded-[2rem] md:shadow-2xl md:overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-700" />
          </button>
          <h1 className="text-base font-bold text-black">Become a Member</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">

          {/* Icon with badge */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-sky-100 flex items-center justify-center">
              <div className="relative">
                <ClipboardList size={52} className="text-sky-600" strokeWidth={1.5} />
                <Clock
                  size={22}
                  className="absolute -bottom-1 -right-2 text-sky-600 bg-sky-100 rounded-full p-0.5"
                  strokeWidth={2}
                />
              </div>
            </div>
            <div className="absolute -top-1 right-0 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              <Clock size={10} />
              PROCESSING
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-black text-black">Request Pending</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
              Your payment request has been sent. Please wait while our administrator activates your membership. You will be notified once it is active.
            </p>
          </div>

          {/* Next Steps card */}
          <div className="w-full rounded-2xl border border-sky-200 bg-sky-50 px-4 py-4 flex items-start gap-3">
            <Info size={16} className="text-sky-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-sky-700">Next Steps</p>
              <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                Verification typically takes 24-48 hours. Check your email for updates.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
