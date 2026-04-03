"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export const Header = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="w-full bg-[#051F25]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <p
          onClick={() => router.push("/")}
          className="font-bold text-2xl text-sky-400 cursor-pointer"
        >
          Tokalot
        </p>

        <nav className="hidden md:flex gap-8 text-sm text-slate-400">
          <button
            onClick={() => router.push("/")}
            className="hover:text-sky-400 transition"
          >
            Home
          </button>
          <button className="hover:text-sky-400 transition">
            How it works
          </button>
          <button className="hover:text-sky-400 transition">Mentors</button>
          <button className="hover:text-sky-400 transition">Membership</button>
        </nav>

        <div className="hidden md:flex gap-4 text-sm">
          {isLoaded && (isSignedIn ? (
            <>
              <button
                onClick={() => router.push("/user")}
                className="text-slate-400 hover:text-sky-400 transition"
              >
                Dashboard
              </button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-slate-400 hover:text-sky-400 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-5 py-2 rounded-xl bg-linear-to-r from-[#0088AA] to-[#00B4D8] text-white shadow-md hover:opacity-90 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden px-4 py-2 rounded-xl bg-sky-400 text-[#004963]"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 text-slate-300">
          <button onClick={() => router.push("/")}>Home</button>
          <button>How it works</button>
          <button>Mentors</button>
          <button>Membership</button>

          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            {isLoaded && (isSignedIn ? (
              <>
                <button
                  onClick={() => router.push("/user")}
                  className="text-left"
                >
                  Dashboard
                </button>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-left">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-sky-400 text-[#004963] px-4 py-2 rounded-xl">
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
