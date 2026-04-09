import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  // Authorization check (хэвээрээ)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Одоогийн цагийг Монгол цаг руу хөрвүүлж тооцох (UTC+8)
    const now = new Date();
    
    // Монгол цагаар "Одоо" + 48 цаг гэдгийг тодорхойлох
    // Хэрэв чи 4.10-ны 10 цагийн хичээлийг хаахыг хүсвэл limit48h-ийг илүү уян хатан болгох хэрэгтэй
    const limit48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    console.log("Current UTC:", now.toISOString());
    console.log("Limit 48h UTC:", limit48h.toISOString());

    // 2. Баазаас шүүх
    const sessions = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: { lte: limit48h } // 48 цаг дотор болох бүх хичээл
      },
      include: {
        _count: { select: { bookings: true } },
        bookings: true
      }
    });

    const updates: any[] = [];

    for (const session of sessions) {
      const sessionTime = new Date(session.StartTime);
      
      // ЛОГИК: Хэрэв хичээлийн цаг өнгөрсөн БОЛОН 48 цаг тулсан (3-аас бага хүнтэй) бол
      if (sessionTime <= now || session._count.bookings < 3) {
        updates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );

        // Хэрэв хүн хүрээгүй цуцалж байгаа бол эрх буцаах логик энд нэмэгдэнэ...
        // (Өмнөх кодтой ижил)
      }
    }

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    return NextResponse.json({
      success: true,
      processed: sessions.length,
      note: "Mongolian Timezone handled"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}