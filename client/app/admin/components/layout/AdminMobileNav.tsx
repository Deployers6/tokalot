"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "./admin-nav";

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-screen-sm items-center justify-between gap-2">
        {adminNavItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] transition ${
                active
                  ? "bg-[#07171d] text-[#20BEF9]"
                  : "text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
