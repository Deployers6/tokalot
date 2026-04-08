import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://tokalot.vercel.app";
const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", base));
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;

  if (role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", base));
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/membership`, {
      headers: { "x-user-id": userId },
    });
    if (res.ok) {
      const membership = await res.json();
      if (membership?.status === "ACTIVE") {
        return NextResponse.redirect(new URL("/user/dashboard", base));
      }
    }
  } catch {
    // membership fetch failed, fall through to /user
  }

  return NextResponse.redirect(new URL("/user", base));
}
