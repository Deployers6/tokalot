"use client";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

interface AuthControlsProps {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  mobile?: boolean;
  onMyPage: () => void;
}

export function AuthControls({
  isLoaded,
  isSignedIn,
  mobile,
  onMyPage,
}: AuthControlsProps) {
  if (!isLoaded) return null;
  if (isSignedIn) {
    return (
      <>
        <button onClick={onMyPage} className={mobile ? "text-left py-2" : "text-slate-400 hover:text-sky-400"}>
          My Page
        </button>
        <UserButton />
      </>
    );
  }

  return (
    <>
      <SignInButton mode="modal" forceRedirectUrl="/">
        <button className={mobile ? "rounded-xl bg-sky-400 px-4 py-2 font-bold text-[#004963]" : "text-slate-400 hover:text-sky-400"}>
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal" forceRedirectUrl="/">
        <button className={mobile ? "rounded-xl bg-sky-400 px-4 py-2 font-bold text-[#004963]" : "rounded-xl bg-linear-to-r from-[#0088AA] to-[#00B4D8] px-5 py-2 text-white shadow-md"}>
          Sign Up
        </button>
      </SignUpButton>
    </>
  );
}
