"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { AdminContentFrame } from "./AdminContentFrame";
import { AdminDesktopSidebar } from "./AdminDesktopSidebar";
import { AdminMobileNav } from "./AdminMobileNav";
import { AdminTopBar } from "./AdminTopBar";
import { img } from "framer-motion/client";

interface AdminShellProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  actions?: ReactNode;
  mobileHeaderActions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  mobileTitle?: string;
  mobileNav?: boolean;
}

export function AdminShell({
  children,
  eyebrow,
  title,
  actions,
  mobileHeaderActions,
  backHref,
  backLabel,
  mobileTitle,
  mobileNav = true,
}: AdminShellProps) {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#e8f3f8] lg:min-h-screen lg:p-8">
      <div className="mx-auto flex min-h-dvh max-w-[1440px] gap-6 lg:min-h-[calc(100dvh-4rem)]">
        <AdminDesktopSidebar />
        <AdminContentFrame navVisible={mobileNav}>
          <div className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-white/10 bg-[#092229] px-5 text-white lg:hidden">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex min-w-0 items-center gap-3 text-sm font-black tracking-tight"
              >
                <ArrowLeft className="h-5 w-5 text-[#20BEF9]" />
                <span className="truncate">
                  {mobileTitle || title || "Back"}
                </span>
              </Link>
            ) : (
              // <span className="text-2xl font-black"></span>
              <img
                src="/tokalotlogo.png"
                alt="Tokalot"
                height={90}
                width={90}
                className=" absolute top-[-12px] left-0 h-[90px] w-[90px] object-contain"
              />
            )}
            {mobileHeaderActions ? (
              <div className="ml-3 shrink-0">{mobileHeaderActions}</div>
            ) : null}
          </div>
          <AdminTopBar
            eyebrow={eyebrow}
            title={title}
            actions={actions}
            backHref={backHref}
            backLabel={backLabel}
          />
          {children}
        </AdminContentFrame>
      </div>
      {mobileNav ? <AdminMobileNav /> : null}
    </div>
  );
}
