"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "./admin-nav";

export function AdminDesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 rounded-[2rem] bg-[#07171d] p-6 text-white lg:flex lg:flex-col">
      {/* <Link
        href="/"
        className="text-3xl font-black tracking-tight text-[#20BEF9]"
      >
        Tokalot
      </Link> */}
      <Link
        href="/"
        className="text-3xl font-black tracking-tight text-[#20BEF9]"
      >
        <img
          src="/tokalotlogo.png"
          alt="Tokalot"
          height={150}
          width={150}
          className="ml-10"
        />
      </Link>
      <div className="mt-10 space-y-3">
        {adminNavItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                active
                  ? "bg-white text-[#07171d]"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
