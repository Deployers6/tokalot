"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AuthControls } from "./header/AuthControls";
import { DesktopNav } from "./header/DesktopNav";
import { MobileMenu } from "./header/MobileMenu";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const navigate = (id: string) => {
    if (id === "home") {
      router.push("/");
      return setOpen(false);
    }
    if (pathname !== "/") router.push(`/#${id}`);
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const handleMyPage = () => router.push("/api/auth/redirect");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#051F25]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer"
          aria-label="Go to home"
        >
          <Image
            src="/tokalotlogo.png"
            alt="Tokalot"
            width={112}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </button>
        <DesktopNav onNavigate={navigate} />
        <div className="hidden items-center gap-4 text-sm md:flex">
          <AuthControls
            isLoaded={isLoaded}
            isSignedIn={isSignedIn}
            onMyPage={handleMyPage}
          />
        </div>
        <button onClick={() => setOpen((value) => !value)} className="rounded-xl bg-sky-400 px-4 py-2 font-semibold text-[#004963] md:hidden">Menu</button>
      </div>
      <MobileMenu open={open} isLoaded={isLoaded} isSignedIn={isSignedIn} onNavigate={navigate} onMyPage={handleMyPage} onClose={() => setOpen(false)} />
    </header>
  );
};
