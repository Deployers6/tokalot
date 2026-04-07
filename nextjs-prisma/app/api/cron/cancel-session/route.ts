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
    // 1. Одоогийн цагийг UTC-ээр авах (Баазтай тааруулах)
    const nowUTC = new Date();
    
    // 2. 48 цагийн хязгаарыг тогтоох
    const limitUTC = new Date(nowUTC.getTime() + 48 * 60 * 60 * 1000);

    // 3. Хичээлүүдийг шүүх (Одооноос эхлээд 48 цагийн доторх бүх нээлттэй хичээлүүд)
    const sessionsToCheck = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: {
          gte: nowUTC,   // Одооноос хойшхи
          lte: limitUTC, // 48 цагийн доторх
        },
      },
      include: {
        bookings: {
          include: {
            user: true,
          },
        },
        _count: { select: { bookings: true } },
      },
    });

    const cancelledIds: string[] = [];

    for (const session of sessionsToCheck) {
      // Хүн хүрээгүй бол (3-аас бага)
      if (session._count.bookings < 3) {
        
        // Transaction ашиглах нь илүү найдвартай (Хичээл хаах + Эрх буцаах)
        await prisma.$transaction(async (tx) => {
          // А. Хичээлийг цуцлах
          await tx.section.update({
            where: { id: session.id },
            data: { status: false },
          });

          // Б. Захиалга өгсөн хүмүүсийн UsedSessions-ийг буцаах
          for (const booking of session.bookings) {
            await tx.membership.update({
              where: { clerkId: booking.clerkId },
              data: {
                usedSessions: { decrement: 1 },
              },
            });
          }
        });

        // В. Email илгээх (Энэ нь Transaction-аас гадна байх нь зөв)
        for (const booking of session.bookings) {
          if (booking.user?.email) {
            try {
              // Цагийг Монгол формат руу хөрвүүлэх
              const formattedTime = new Date(session.StartTime).toLocaleString('mn-MN', {
                timeZone: 'Asia/Ulaanbaatar',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });

              await resend.emails.send({
                from: 'Tokalot <onboarding@resend.dev>',
                to: booking.user.email,
                subject: 'Хичээл цуцлагдсан тухай мэдэгдэл',
                html: `
                  <div style="font-family: sans-serif; line-height: 1.5;">
                    <h2>Сайн байна уу, ${booking.user.fullName}</h2>
                    <p>Уучлаарай, таны <b>${formattedTime}</b>-т орох байсан хичээл хүн хүрээгүй тул цуцлагдлаа.</p>
                    <p>Таны ашигласан сесс (эрх) автоматаар буцаж орсон тул та өөр цагт захиалга өгөх боломжтой.</p>
                    <br/>
                    <p>Танд амжилт хүсье, Tokalot баг.</p>
                  </div>
                `,
              });
            } catch (mailError) {
              console.error(`Email Error (User: ${booking.user.email}):`, mailError);
            }
          }
        }
        cancelledIds.push(session.id);
      }
    }

    return NextResponse.json({
      message: "Cron job finished",
      checkedCount: sessionsToCheck.length,
      cancelledCount: cancelledIds.length,
    });

  } catch (error: any) {
    console.error("Cron Error Detail:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}