"use client";
import React from "react";
import Link from "next/link";
import { GraduationCap, Users, CalendarRange } from "lucide-react";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "MEMBERS", icon: Users, href: "/admin/members" },
  { label: "TEACHERS", icon: GraduationCap, href: "/admin/teachers" },
  { label: "SESSIONS", icon: CalendarRange, href: "/admin" },
];

export const Footer = () => {
  const pathname = usePathname();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      <div className="bg-black w-full h-[80px] flex justify-between items-center px-10 flex-row-reverse shadow-[0_-4px_15px_rgba(0,0,0,0.2)]">
        {tabs.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;
          return (
            <Link key={label} href={href}>
              <span className="flex flex-col items-center justify-center">
                <Icon
                  className={`h-[28px] w-[28px] transition-colors ${
                    isActive ? "text-[#FFFFFF]" : "text-[#64748B]"
                  }`}
                />
                <span
                  className={`text-[9px] font-extrabold tracking-widest mt-1 transition-colors ${
                    isActive ? "text-white" : "text-[#64748B]"
                  }`}
                >
                  {label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
