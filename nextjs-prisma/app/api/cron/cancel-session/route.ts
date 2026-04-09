import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    
    // МӨНХИЙН ШИЙДЭЛ: 
    // Бааз дээрх UTC цагийг Монгол цагийн 48 цагтай дүйцүүлэхийн тулд 
    // заавал 56 цагаар (48+8) шүүх ёстой. Ингэж байж чиний тэр 4.11-ний 
    // хичээлүүд баазаас шүүгдэж гарч ирнэ.
    const limit56h = new Date(now.getTime() + 56 * 60 * 60 * 1000);

    const sessions = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: { lte: limit56h }
      },
      include: {
        bookings: { include: { user: true } },
        _count: { select: { bookings: true } },
      },
    });

    const updates = [];

    for (const session of sessions) {
      const startTime = new Date(session.StartTime);
      // Хичээл хүртэлх бодит цагийг тооцох
      const hoursUntilSession = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      // hoursUntilSession <= 56 гэдэг нь Монгол цагаар "Яг 48 цаг үлдсэн" гэсэн үг.
      if (hoursUntilSession <= 56 && session._count.bookings < 3) {
        updates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );

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
      foundInDb: sessions.length // Энд хэдэн хичээл баазаас олдсоныг харуулна
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}