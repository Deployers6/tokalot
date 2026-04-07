import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const clerkId = req.headers.get("x-user-id");

  if (!clerkId) {
    return NextResponse.json({ error: "x-user-id header дутуу" }, { status: 400 });
  }

  const membership = await prisma.membership.findUnique({
    where: { clerkId },
    select: { status: true },
  });

  if (!membership) {
    return NextResponse.json({ status: "NO_MEMBERSHIP" });
  }

  return NextResponse.json({ status: membership.status });
}
