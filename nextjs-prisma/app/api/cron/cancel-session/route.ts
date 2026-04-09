import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const now = new Date();
    const limit48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // 1. Шүүлтүүр: Одооноос хойшхи 48 цаг дотор болох БҮХ хичээлийг авна.
    // Өнгөрсөн хичээлүүд StartTime < now учраас автоматаар lte: limit48h-д багтана.
    const sessions = await prisma.section.findMany({
      where: {
        status: true, // Зөвхөн нээлттэй байгааг нь хаахын тулд
        StartTime: { lte: limit48h }
      },
      include: {
        bookings: { include: { user: true } },
        _count: { select: { bookings: true } },
      },
    });

    const sessionUpdates: any[] = [];
    const membershipUpdates: any[] = [];
    const emailsToNotify: any[] = [];

    for (const session of sessions) {
      const startTime = new Date(session.StartTime);

      // --- ЛОГИК А: ХИЧЭЭЛИЙН ЦАГ НЬ ӨНГӨРСӨН БОЛ ШУУД ХААХ ---
      if (startTime <= now) {
        sessionUpdates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );
      } 
      // --- ЛОГИК Б: ИРЭЭДҮЙД (48Ц ДОТОР) БОЛОХ ХИЧЭЭЛ ХҮН ХҮРЭЭГҮЙ БОЛ ЦУЦЛАХ ---
      else if (session._count.bookings < 3) {
        sessionUpdates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );

        // Бүртгүүлсэн хүмүүсийн эрхийг буцаах
        for (const booking of session.bookings) {
          membershipUpdates.push(
            prisma.membership.update({
              where: { clerkId: booking.clerkId },
              data: { usedSessions: { decrement: 1 } }
            })
          );
          
          if (booking.user?.email) {
            emailsToNotify.push({
              email: booking.user.email,
              name: booking.user.fullName,
            });
          }
        }
      }
    }

    // Бааз руу өөрчлөлтүүдийг нэг доор илгээх
    if (sessionUpdates.length > 0 || membershipUpdates.length > 0) {
      await prisma.$transaction([...sessionUpdates, ...membershipUpdates]);
    }

    // Имэйл илгээх хэсэг
    if (emailsToNotify.length > 0) {
      await Promise.all(emailsToNotify.map(data => 
        resend.emails.send({
          from: 'Tokalot <onboarding@resend.dev>',
          to: data.email,
          subject: 'Хичээл цуцлагдсан мэдэгдэл',
          html: `<p>Сайн байна уу, ${data.name}. Таны бүртгүүлсэн хичээл хүн хүрээгүй тул цуцлагдлаа. Таны хичээлийн эрх буцаж орсон байгаа.</p>`
        })
      )).catch(err => console.error("Email error:", err));
    }

    return NextResponse.json({
      success: true,
      processed: sessions.length,
    });

  } catch (error: any) {
    console.error("Cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}