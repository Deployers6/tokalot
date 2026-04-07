import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = (user.publicMetadata as { role?: string })?.role;

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", base));
  }

  return NextResponse.redirect(new URL("/user/dashboard", base));
}
