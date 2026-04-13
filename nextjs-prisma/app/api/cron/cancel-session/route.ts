import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Одоогийн цагийг Монгол цагт шилжүүлэх (GMT+8)
    const nowMN = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);

    // 2. Баазаас status: true байгаа БҮХ хичээлийг авах
    // (LTE шүүлтүүр заримдаа UTC зөрүүгээс болоод дата орхидог тул бүгдийг нь аваад дотор нь шүүх нь хамгийн найдвартай)
    const allActiveSessions = await prisma.section.findMany({
      where: { status: true },
      include: {
        bookings: true,
        _count: { select: { bookings: true } },
      },
    });

    const updates = [];

    for (const session of allActiveSessions) {
      // 3. Хичээлийн StartTime-г Монгол цагт шилжүүлэх (GMT+8)
      const sessionStartMN = new Date(new Date(session.StartTime).getTime() + 8 * 60 * 60 * 1000);

      // 4. Цагийн зөрүүг тооцох (Монгол цагаар)
      const diffInMs = sessionStartMN.getTime() - nowMN.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      // ШАЛГАЛТ: Хэрэв хичээл эхлэхэд 48 цаг болон түүнээс бага хугацаа үлдсэн бол (эсвэл өнгөрсөн бол)
      if (diffInHours <= 48) {
        
        // А. LOCK: Хичээлийг хаах (status: false)
        updates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );

        // Б. CANCEL: Хэрэв хүний тоо 3 хүрээгүй бол эрхийг нь буцаах
        if (session._count.bookings < 3) {
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
    }

    // 5. Өөрчлөлтүүдийг бааз руу илгээх
    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    return NextResponse.json({
      success: true,
      timeNowMN: nowMN.toISOString(),
      found: allActiveSessions.length,
      updated: updates.length,
      message: "48 цаг доторх бүх хичээлийг түгжиж, хүнгүй бол цуцаллаа."
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}