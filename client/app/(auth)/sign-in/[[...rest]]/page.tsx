"use client";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#051F25]">
      <SignIn routing="path" path="/sign-in" forceRedirectUrl="/api/auth/redirect" />
    </div>
  );
}
