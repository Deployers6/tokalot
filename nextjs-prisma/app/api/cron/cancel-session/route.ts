import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  
  // 1. Security Check
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    // Одооноос ирэх 48 цаг хүртэлх хугацаа
    const limit = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // 2. Шалгах шаардлагатай хичээлүүдээ авах
    // "gt: now" гэдгийг хассан тул өнгөрсөн хугацааны (Жишээ нь 4.3-ны) хаагдаагүй хичээлүүд орж ирнэ.
    const sessionsToCheck = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: { lte: limit }, 
      },
      include: {
        bookings: true, // membership update-д хэрэгтэй
        _count: { select: { bookings: true } },
      },
    });

    const cancelledIds: string[] = [];

    for (const session of sessionsToCheck) {
      // 3 хүрэхгүй хүнтэй бол цуцлах логик
      if (session._count.bookings < 3) {
        
        // А. ПРИСМА ТРАНЗАКЦ: Хичээл хаах + Сурагчдын эрхийг буцаах
        await prisma.$transaction(async (tx) => {
          // 1. Хичээлийг статусгүй болгох
          await tx.section.update({
            where: { id: session.id },
            data: { status: false },
          });

          // 2. Тухайн хичээлд бүртгүүлсэн сурагч бүрийн usedSessions-ийг хасаж, түүх үүсгэх
          for (const booking of session.bookings) {
            await tx.membership.update({
              where: { clerkId: booking.clerkId },
              data: {
                usedSessions: { decrement: 1 }, // Ашигласан сессийг -1 болгоно (эрх нэмэгдэнэ)
                history: {
                  create: {
                    action: "CLASS_CANCELLED_REFUND",
                    change: 1, // Түүх дээр +1 эрх ирлээ гэж харагдана
                  },
                },
              },
            });
          }
        });

        // Б. ИМЭЙЛ ИЛГЭЭХ (Транзакцын гадна хийх нь аюулгүй)
        // Энэ хэсэгт бүртгүүлсэн хэрэглэгчдийн мэдээллийг дахин аваад имэйл илгээнэ
        const bookingsWithUsers = await prisma.booking.findMany({
          where: { sectionId: session.id },
          include: { user: true }
        });

        for (const b of bookingsWithUsers) {
          if (b.user?.email) {
            try {
              await resend.emails.send({
                from: 'Tokalot <onboarding@resend.dev>',
                to: b.user.email,
                subject: 'Хичээл цуцлагдсан тухай мэдэгдэл',
                html: `
                  <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2>Сайн байна уу, ${b.user.fullName}</h2>
                    <p>Уучлаарай, таны <b>${session.StartTime.toLocaleString('mn-MN')}</b> цагт товлогдсон хичээл хүн хүрээгүй (3-аас доош) тул цуцлагдлаа.</p>
                    <p style="color: #d97706; font-weight: bold;">Таны ашигласан 1 сесс (эрх) автоматаар таны дансанд буцаж орсон тул та өөр цагт захиалга өгөх боломжтой.</p>
                    <hr />
                    <p>Танд амжилт хүсье, Tokalot баг.</p>
                  </div>
                `,
              });
            } catch (e) {
              console.error("Email error:", e);
            }
          }
        }
        cancelledIds.push(session.id);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cron process completed successfully",
      stats: {
        checkedTotal: sessionsToCheck.length,
        cancelledCount: cancelledIds.length,
        cancelledIds: cancelledIds
      }
    });

  } catch (error: any) {
    console.error("Cron Error Detail:", error);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}