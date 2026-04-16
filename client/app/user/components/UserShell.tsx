import { ReactNode } from "react";
import { UserBottomNav } from "./UserBottomNav";
import type { UserNavValue } from "./user-nav";

interface UserShellProps {
  header: ReactNode;
  children: ReactNode;
  navTab?: UserNavValue;
}

export function UserShell({ header, children, navTab }: UserShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center md:bg-neutral-200 md:py-10">
      <div className="relative flex min-h-screen w-full flex-col bg-white md:h-[860px] md:min-h-0 md:w-[390px] md:overflow-hidden md:rounded-[2rem] md:shadow-2xl">
        {header}
        <div className={`flex-1 overflow-y-auto ${navTab ? "pb-24" : "pb-8"}`}>{children}</div>
        {navTab ? <UserBottomNav active={navTab} /> : null}
      </div>
    </div>
  );
}
