import React from "react";
import { GraduationCap, Users, CalendarRange } from "lucide-react";
const Footer = () => {
  return (
    <div className="">
      <div className="bg-black w-screen h-[75px] rounded-tr-2xl rounded-tl-2xl flex justify-between items-center px-10">
        <div className="flex flex-col items-center justify-center">
          <Users className="text-[#64748B] h-[30px] w-[30px]" />
          <div className="text-[#64748B] text-[10px] font-extrabold tracking-widest">
            USERS
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <GraduationCap className="text-[#64748B] h-[30px] w-[30px]" />
          <div className="text-[#64748B] text-[10px] font-extrabold tracking-widest">
            TEACHER
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <CalendarRange className="text-[#64748B] h-[30px] w-[30px]" />
          <div className="text-[#64748B] text-[10px] font-extrabold tracking-widest">
            SESSIONS
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
