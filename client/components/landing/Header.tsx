"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  const handleMyPage = () => {
    router.push("/api/auth/redirect");
  };

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setOpen(false);
  };

  return (
    <header className="w-full bg-[#051F25]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <p
          onClick={() => router.push("/")}
          className="font-bold text-2xl text-sky-400 cursor-pointer"
        >
          Tokalot
        </p>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm text-slate-400 font-medium">
          <button
            onClick={() => router.push("/")}
            className="hover:text-sky-400 transition"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("how-it-works")}
            className="hover:text-sky-400 transition"
          >
            How it works
          </button>
          <button
            onClick={() => scrollToSection("mentors")}
            className="hover:text-sky-400 transition"
          >
            Mentors
          </button>
          <button
            onClick={() => scrollToSection("membership")}
            className="hover:text-sky-400 transition"
          >
            Membership
          </button>
        </nav>

        <div className="hidden md:flex gap-4 text-sm items-center">
          {isLoaded &&
            (isSignedIn ? (
              <>
                <button
                  onClick={() => handleMyPage()}
                  className="text-slate-400 hover:text-sky-400 transition"
                >
                  My Page
                </button>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode="modal" forceRedirectUrl="/api/auth/redirect">
                  <button className="text-slate-400 hover:text-sky-400 transition">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/api/auth/redirect">
                  <button className="px-5 py-2 rounded-xl bg-linear-to-r from-[#0088AA] to-[#00B4D8] text-white shadow-md hover:opacity-90 transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden px-4 py-2 rounded-xl bg-sky-400 text-[#004963] font-semibold"
        >
          Menu
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-5 text-slate-300 font-medium bg-[#051F25]">
          <button
            className="text-left py-2 border-b border-white/5"
            onClick={() => {
              router.push("/");
              setOpen(false);
            }}
          >
            Home
          </button>
          <button
            className="text-left py-2 border-b border-white/5"
            onClick={() => scrollToSection("how-it-works")}
          >
            How it works
          </button>
          <button
            className="text-left py-2 border-b border-white/5"
            onClick={() => scrollToSection("mentors")}
          >
            Mentors
          </button>
          <button
            className="text-left py-2 border-b border-white/5"
            onClick={() => scrollToSection("membership")}
          >
            Membership
          </button>

          <div className="flex flex-col gap-3 pt-2">
            {isLoaded &&
              (isSignedIn ? (
                <>
                  <button
                    onClick={() => handleMyPage()}
                    className="text-left py-2"
                  >
                    My Page
                  </button>
                  <UserButton />
                </>
              ) : (
                <>
                  <SignInButton mode="modal" forceRedirectUrl="/api/auth/redirect">
                    <button className="bg-sky-400 text-[#004963] px-4 py-2 rounded-xl text-center font-bold">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/api/auth/redirect">
                    <button className="bg-sky-400 text-[#004963] px-4 py-2 rounded-xl text-center font-bold">
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              ))}
          </div>
        </div>
      )}
    </header>
  );
};
