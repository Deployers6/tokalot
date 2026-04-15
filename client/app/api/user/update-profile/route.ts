import { clerkClient, auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://tokalot.vercel.app";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName } = await req.json();

    const client = await clerkClient();
    await client.users.updateUser(userId, { firstName, lastName });

    // database-д ч шинэчилнэ
    await fetch(`${BACKEND_URL}/api/admin/patch-user`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetClerkId: userId,
        adminClerkId: userId,
        firstName,
        lastName,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
