import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Одоогийн цагийг авах
    const now = new Date();
    
    // 2. МОНГОЛ ЦАГИЙН ЗӨРҮҮГ ЗАСАХ ЛОГИК (48 цаг):
    // Бааз дээрх цаг Монгол цагаас 8 цагаар түрүүлж (UTC) хадгалагдсан байгаа тул
    // 48 цагаас 8 цагийг хасч 40 цаг болгоно.
    // Ингэснээр Frontend дээр 48 цагийн өмнө хаагдаж байгаа мэт яг зөв харагдана.
    const limit48hAdjusted = new Date(now.getTime() + (48 - 8) * 60 * 60 * 1000);

    const sessions = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: { lte: limit48hAdjusted }
      },
      include: {
        _count: { select: { bookings: true } },
        bookings: { include: { user: true } }
      },
    });

    const updates = [];

    for (const session of sessions) {
      if (session._count.bookings < 3) {
        // Хичээлийг хаах
        updates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );
        
        // Хүмүүсийн эрхийг буцаах
        for (const booking of session.bookings) {
          updates.push(
            prisma.membership.update({
              where: { clerkId: booking.clerkId },
              data: { usedSessions: { decrement: 1 } }
            })
          );
        }
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    return NextResponse.json({
      success: true,
      processed: sessions.length,
      note: "48h logic with 8h timezone offset adjustment"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}