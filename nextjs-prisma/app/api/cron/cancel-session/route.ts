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
    
    // 2. БОДИТ ШҮҮЛТҮҮР (Монгол цагт тааруулсан 48 цаг):
    // Чиний бааз UTC-ээр хадгалдаг тул (48 + 8) = 56 цаг гэж шүүж байж 
    // Монгол цагаар "яг 48 цаг үлдсэн" хичээлүүд чинь баазаас гарч ирнэ.
    const limitTime = new Date(now.getTime() + 56 * 60 * 60 * 1000);

    const sessions = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: { lte: limitTime }
      },
      include: {
        _count: { select: { bookings: true } },
        bookings: true
      },
    });

    const updates = [];

    for (const session of sessions) {
      const startTime = new Date(session.StartTime);
      
      // Хичээл хүртэлх бодит цагийг тооцох (цагаар)
      const hoursUntilSession = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Чиний логик: 48 цаг дотор орсон БӨГӨӨД хүн нь 3 хүрээгүй бол:
      // (hoursUntilSession <= 56 гэдэг нь Монгол цагаар яг 48 цаг үлдсэн гэсэн үг)
      if (hoursUntilSession <= 56 && session._count.bookings < 3) {
        updates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );
        
        // Эрх буцаах логик
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
      processed: updates.length,
      foundInDb: sessions.length
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}