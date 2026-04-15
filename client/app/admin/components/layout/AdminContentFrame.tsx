import { ReactNode } from "react";

interface AdminContentFrameProps {
  children: ReactNode;
  navVisible?: boolean;
}

export function AdminContentFrame({
  children,
  navVisible = true,
}: AdminContentFrameProps) {
  return (
    <main className="flex min-h-dvh flex-1 flex-col overflow-hidden bg-white lg:min-h-[calc(100dvh-4rem)] lg:rounded-[2rem]">
      <div
        className={`flex-1 overflow-y-auto bg-[#f8fdff] ${
          navVisible ? "pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-8" : ""
        }`}
      >
        {children}
      </div>
    </main>
  );
}
