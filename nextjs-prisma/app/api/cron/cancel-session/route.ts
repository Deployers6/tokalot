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

    // 1. ШҮҮЛТҮҮР: Зөвхөн 48 цаг тулсан болон өнгөрсөн бүх хичээлийг авна.
    // 'status: true' гэж шүүхгүй, учир нь бид бүгдийг нь "баттай" хаахыг хүсэж байгаа.
    const sessions = await prisma.section.findMany({
      where: {
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

      // --- ЛОГИК А: ЦУЦЛАХ БОЛОН ЭРХ БУЦААХ (48 цаг тулсан, хүн хүрээгүй, ОДОО НЭЭЛТТЭЙ байгаа бол) ---
      if (session._count.bookings < 3 && session.status === true) {
        sessionUpdates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );

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
              time: startTime
            });
          }
        }
      } 
      
      // --- ЛОГИК Б: ХУГАЦАА ӨНГӨРСӨН БОЛ ШУУД ХААХ ---
      // Хэрэв хичээлийн цаг нь одооноос өмнө (StartTime <= now) бол 
      // бааз дээр true/false байх нь хамаагүй, шууд status: false болгоно.
      else if (startTime <= now) {
        sessionUpdates.push(
          prisma.section.update({
            where: { id: session.id },
            data: { status: false }
          })
        );
      }
    }

    // 2. БААЗ РУУ TRANSACTION ИЛГЭЭХ
    if (sessionUpdates.length > 0 || membershipUpdates.length > 0) {
      await prisma.$transaction([...sessionUpdates, ...membershipUpdates]);
    }

    // 3. ИМЭЙЛ ИЛГЭЭХ (Зөвхөн цуцлагдсан хүмүүс рүү)
    emailsToNotify.forEach(data => {
      resend.emails.send({
        from: 'Tokalot <onboarding@resend.dev>',
        to: data.email,
        subject: 'Хичээл цуцлагдсан мэдэгдэл',
        html: `<p>Сайн байна уу, ${data.name}. Таны хичээл хүн хүрээгүй тул цуцлагдлаа.</p>`
      }).catch(err => console.error(err));
    });

    return NextResponse.json({
      success: true,
      processed: sessions.length, // Одоо энэ тоо 0-ээс их гарна
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}