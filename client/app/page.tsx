"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Tokalot</h1>

      <div className="mt-6 flex items-center gap-4">
        <SignInButton mode="modal">Sign in</SignInButton>
        <UserButton />
      </div>
    </main>
  );
}
