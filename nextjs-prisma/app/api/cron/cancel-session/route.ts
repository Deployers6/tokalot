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
    
    // МӨНХИЙН ШИЙДЭЛ: 
    // 48 цаг + Монголын 8 цагийн зөрүү = 56 цаг.
    // Ингэснээр бааз дээр UTC-ээр хадгалагдсан хичээлүүд 
    // Монгол цагаар "яг 48 цагийн өмнө" хаагдаж эхэлнэ.
    const limitTime = new Date(now.getTime() + (48 + 8) * 60 * 60 * 1000);

    const sessions = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: { lte: limitTime }
      },
      include: {
        bookings: { include: { user: true } },
        _count: { select: { bookings: true } },
      },
    });

    const sessionUpdates = [];
    const membershipUpdates = [];
    const emailsToNotify = [];

    for (const session of sessions) {
      const startTime = new Date(session.StartTime);

      // 1. Цаг нь өнгөрсөн бол шууд хаах
      if (startTime <= now) {
        sessionUpdates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );
      } 
      // 2. 48 цаг тулсан (Монгол цагаар тооцоход) бөгөөд 3-аас бага хүнтэй бол
      else if (session._count.bookings < 3) {
        sessionUpdates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );

        // Хэрэглэгчдийн эрхийг буцаах
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

    if (sessionUpdates.length > 0 || membershipUpdates.length > 0) {
      await prisma.$transaction([...sessionUpdates, ...membershipUpdates]);
    }

    // Имэйл илгээх (Resend)
    if (emailsToNotify.length > 0) {
      await Promise.all(emailsToNotify.map(data => 
        resend.emails.send({
          from: 'Tokalot <onboarding@resend.dev>',
          to: data.email,
          subject: 'Хичээл цуцлагдсан мэдэгдэл',
          html: `<p>Сайн байна уу, ${data.name}. Таны бүртгүүлсэн хичээл хүн хүрээгүй тул цуцлагдлаа. Эрх буцаж орсон.</p>`
        })
      )).catch(err => console.error("Email error:", err));
    }

    return NextResponse.json({
      success: true,
      processed: sessions.length,
      currentTime: now.toISOString(),
      checkLimit: limitTime.toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}