import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Одоогийн цагийг Монгол цагийн бүсээр тооцож авах
    const now = new Date();
    
    // Монголын цагийг (Asia/Ulaanbaatar) зааж өгч байна. 
    // Энэ нь сервер хаана байхаас үл хамааран Улаанбаатарын цагийг барина.
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ulaanbaatar",
      year: "numeric", month: "numeric", day: "numeric",
      hour: "numeric", minute: "numeric", second: "numeric",
      hour12: false,
    });

    // 2. 48 цагийн хязгаар тогтоох (Монгол цагаар)
    const limit48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Баазаас шүүх:
    const sessions = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: { lte: limit48h } 
      },
      include: {
        _count: { select: { bookings: true } },
        bookings: true,
      },
    });

    const sessionUpdates = [];
    const membershipUpdates = [];

    for (const session of sessions) {
      const startTime = new Date(session.StartTime);

      // Монгол цагаар харьцуулах логик:
      // Хэрэв хичээлийн цаг нь өнгөрсөн бол (startTime <= now) шууд хаана.
      // Хэрэв 48 цаг дотор байгаа бөгөөд 3-аас бага хүнтэй бол хаана.
      if (startTime <= now || session._count.bookings < 3) {
        sessionUpdates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );

        // Хэрэв хүн хүрээгүй цуцалж байгаа бол (startTime > now) эрхийг нь буцаана
        if (startTime > now) {
          for (const booking of session.bookings) {
            membershipUpdates.push(
              prisma.membership.update({
                where: { clerkId: booking.clerkId },
                data: { usedSessions: { decrement: 1 } }
              })
            );
          }
        }
      }
    }

    if (sessionUpdates.length > 0 || membershipUpdates.length > 0) {
      await prisma.$transaction([...sessionUpdates, ...membershipUpdates]);
    }

    return NextResponse.json({
      success: true,
      processed: sessions.length,
      mnTimeNow: now.toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" }),
      mnLimitTime: limit48h.toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" })
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}