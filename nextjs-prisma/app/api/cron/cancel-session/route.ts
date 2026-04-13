import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  // 1. Vercel Cron хамгаалалт
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 2. Улаанбаатарын одоогийн цагийг авах (Сэрвер хаана байхаас үл хамаарна)
    const nowMN = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Ulaanbaatar" })
    );

    // 3. Баазаас идэвхтэй байгаа (status: true) бүх хичээлийг авах
    const activeSessions = await prisma.section.findMany({
      where: { status: true },
      include: {
        bookings: true,
        _count: { select: { bookings: true } },
      },
    });

    const updates = [];

    for (const session of activeSessions) {
      // 4. Баазын цагийг унших (Баазад 13:00 гэж байвал шууд 13:00 гэж авна)
      const sessionStart = new Date(session.StartTime);

      // 5. Цагийн зөрүүг тооцох (цагаар)
      const diffInMs = sessionStart.getTime() - nowMN.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      // ЛОГИК: 48 цаг болон түүнээс бага хугацаа үлдсэн (эсвэл өнгөрсөн) бол
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

    // 6. Бааз руу өөрчлөлтүүдийг нэг дор илгээх
    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    return NextResponse.json({
      success: true,
      data: {
        currentTimeMN: nowMN.toLocaleString(), // Чиний Postman дээр яг одоогийн цагийг харуулна
        sessionsFound: activeSessions.length,
        actuallyUpdated: updates.length
      }
    });

  } catch (error: any) {
    console.error("Cron Job Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}