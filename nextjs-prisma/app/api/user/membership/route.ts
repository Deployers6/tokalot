import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const clerkId = req.headers.get("x-user-id");
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await prisma.membership.findUnique({
      where: { clerkId },
    });

    if (!membership) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      status: membership.status,
      startDate: membership.startDate,
      endDate: membership.endDate,
      totalSessions: membership.totalSessions,
      usedSessions: membership.usedSessions,
      remainingSessions: membership.totalSessions - membership.usedSessions,
    });
  } catch (error) {
    console.error("[MEMBERSHIP_GET_ERROR]", error);
    return NextResponse.json({ error: "Серверт алдаа гарлаа" }, { status: 500 });
  }
}
