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
    <div className="fixed bottom-0 left-0 right-0">
      <div className="bg-black w-full h-[75px] rounded-tr-2xl rounded-tl-2xl flex justify-between items-center px-10">
        {tabs.map(({ label, icon: Icon, href }) => {
          const isActive = pathname === href;

          return (
            <Link key={label} href={href}>
              <span className="flex flex-col items-center justify-center">
                <Icon
                  className={`h-[30px] w-[30px] transition-colors ${
                    isActive ? "text-white" : "text-[#64748B]"
                  }`}
                />
                <span
                  className={`text-[10px] font-extrabold tracking-widest transition-colors ${
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
