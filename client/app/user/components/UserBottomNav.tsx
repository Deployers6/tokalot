"use client";

import Link from "next/link";
import { userNavItems, type UserNavValue } from "./user-nav";

export function UserBottomNav({ active }: { active: UserNavValue }) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-black py-3">
      {userNavItems.map(({ href, value, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
            active === value ? "text-sky-400" : "text-slate-500"
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
