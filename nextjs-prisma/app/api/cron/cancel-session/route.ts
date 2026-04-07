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
    const limit = new Date(now.getTime() + 48 * 60 * 60 * 1000);

   
    const sessionsToCheck = await prisma.section.findMany({
      where: {
        status: true,
        StartTime: { lte: limit, gt: now },
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
      if (session._count.bookings < 3) {
     
        await prisma.section.update({
          where: { id: session.id },
          data: { status: false },
        });

      
        for (const booking of session.bookings) {
          if (booking.user.email) {
            try {
              await resend.emails.send({
                from: 'Tokalot <onboarding@resend.dev>',
                to: booking.user.email,
                subject: 'Хичээл цуцлагдсан тухай мэдэгдэл',
                html: `
                  <h1>Сайн байна уу, ${booking.user.fullName}</h1>
                  <p>Уучлаарай, таны <b>${session.StartTime.toLocaleString()}</b>-т орох байсан хичээл хүн хүрээгүй тул цуцлагдлаа.</p>
                  <p>Таны ашигласан сесс (эрх) автоматаар буцаж орсон тул та өөр цагт захиалга өгөх боломжтой.</p>
                  <br/>
                  <p>Танд амжилт хүсье, Tokalot баг.</p>
                `,
              });
            } catch (mailError) {
              console.error(`Email илгээхэд алдаа (User: ${booking.user.email}):`, mailError);
            }
          }
        }
        cancelledIds.push(session.id);
      }
    }

    return NextResponse.json({
      message: "Cron completed and emails sent",
      checked: sessionsToCheck.length,
      cancelledCount: cancelledIds.length,
    });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}