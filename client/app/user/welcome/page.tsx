"use client";

import { useRouter } from "next/navigation";
import { CalendarCheck, BadgeCheck, Bell } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center md:bg-neutral-200 md:py-10">
      <div className="relative flex w-full flex-col bg-white min-h-screen md:min-h-0 md:w-[390px] md:h-[860px] md:rounded-[2rem] md:shadow-2xl md:overflow-hidden">

        {/* Header */}
        <div className="bg-black px-6 py-5">
          <h1 className="text-2xl font-extrabold text-white">Tokalot</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-7">

          {/* Icon with notification badge */}
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-sky-100 flex items-center justify-center">
              <BadgeCheck size={64} className="text-sky-700" strokeWidth={1.5} />
            </div>
            {/* Notification bell badge */}
            <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
              <Bell size={16} className="text-white" fill="white" />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="text-3xl font-black text-black leading-tight">
              Welcome to<br />Tokalot!
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[260px]">
              Your payment was successful. You are now a member of our speaking club.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/user/dashboard")}
            className="flex items-center justify-center gap-2 w-full max-w-[280px] rounded-full bg-sky-500 py-4 text-sm font-bold text-white shadow-lg hover:bg-sky-600 transition-colors"
          >
            <CalendarCheck size={18} />
            Book Your First Session
          </button>

        </div>

      </div>
    </div>
  );
}
