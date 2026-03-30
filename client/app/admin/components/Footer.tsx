// Footer.tsx
import React from "react";
import Link from "next/link";
import { GraduationCap, Users, CalendarRange } from "lucide-react";

export const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="bg-black w-full h-[75px] rounded-tr-2xl rounded-tl-2xl flex justify-between items-center px-10">
        <Link href="/admin/users">
          <span className="flex flex-col items-center justify-center">
            <Users className="text-[#64748B] h-[30px] w-[30px]" />
            <span className="text-[#64748B] text-[10px] font-extrabold tracking-widest">
              USERS
            </span>
          </span>
        </Link>
        <Link href="/admin/teachers">
          <span className="flex flex-col items-center justify-center">
            <GraduationCap className="text-[#64748B] h-[30px] w-[30px]" />
            <span className="text-[#64748B] text-[10px] font-extrabold tracking-widest">
              TEACHER
            </span>
          </span>
        </Link>
        <Link href="/admin">
          <span className="flex flex-col items-center justify-center">
            <CalendarRange className="text-[#64748B] h-[30px] w-[30px]" />
            <span className="text-[#64748B] text-[10px] font-extrabold tracking-widest">
              SESSIONS
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
