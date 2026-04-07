import { clerkClient, auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Нэвтрээгүй байна" }, { status: 401 });
    }

    const { firstName, lastName } = await req.json();

    const client = await clerkClient();
    await client.users.updateUser(userId, { firstName, lastName });

    await prisma.user.update({
      where: { clerkId: userId },
      data: { fullName: `${firstName || ""} ${lastName || ""}`.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
