import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const now = new Date();
    const limit = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const sessionsToCheck = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: {
          lte: limit,
          gt: now,
        },
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
    const cancelledIds: string[] = [];
    for (const session of sessionsToCheck) {
      if (session._count.bookings < 3) {
        await prisma.section.update({
          where: { id: session.id },
          data: { status: false },
        });
        cancelledIds.push(session.id);
      }
    }
    return NextResponse.json({
      message: "Cron completed",
      checked: sessionsToCheck.length,
      cancelledCount: cancelledIds.length,
      cancelledIds,
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
